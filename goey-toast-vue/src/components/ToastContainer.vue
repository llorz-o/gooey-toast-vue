<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { _toasts, _onToastDismissed } from '../gooey-toast'
import { containerHovered } from '../context'
import type { ToastPosition } from '../types'
import { PH } from '../morph'
import ToastErrorBoundary from './ToastErrorBoundary.vue'
import GooeyToast from './GooeyToast.vue'

const props = withDefaults(defineProps<{
  position: ToastPosition
  gap: number
  offset: number | string
  theme: 'light' | 'dark'
  dir: 'ltr' | 'rtl'
  visibleToasts: number
}>(), {
  position: 'bottom-right',
  gap: 14,
  offset: '24px',
  theme: 'light',
  dir: 'ltr',
  visibleToasts: 3,
})

interface LayoutState {
  yOffset: number
  scale: number
  opacity: number
}

const heights = reactive(new Map<string | number, number>())
const displayedLayout = reactive(new Map<string | number, LayoutState>())
const containerRef = ref<HTMLElement | null>(null)
let pendingFrame: number | null = null

function handleHeightChange(id: string | number, height: number) {
  heights.set(id, height)
}

function handleDismiss(id: string | number) {
  heights.delete(id)
  displayedLayout.delete(id)
  _onToastDismissed(id)
}

function onMouseEnter() {
  containerHovered.value = true
}

function onMouseLeave() {
  containerHovered.value = false
}

function cancelPendingFrame() {
  if (pendingFrame !== null) {
    cancelAnimationFrame(pendingFrame)
    pendingFrame = null
  }
}

const isBottom = computed(() => props.position.startsWith('bottom'))

const COLLAPSED_STACK_STEP = 12
const COLLAPSED_SCALE_STEP = 0.02
const MIN_STACK_SCALE = 0.96
const EXPANDED_STACK_EXTRA_MAX = 18

function getMeasuredHeight(id: string | number) {
  return heights.get(id) ?? PH
}

function isExpandedHeight(height: number) {
  return height > PH + 2
}

function getCollapsedContribution(id: string | number) {
  const height = getMeasuredHeight(id)
  if (!isExpandedHeight(height)) return COLLAPSED_STACK_STEP
  return Math.min(COLLAPSED_STACK_STEP + (height - PH), COLLAPSED_STACK_STEP + EXPANDED_STACK_EXTRA_MAX)
}

const expandedHeight = computed(() => {
  let total = 0
  const toasts = _toasts.value
  for (let i = 0; i < toasts.length; i++) {
    total += heights.get(toasts[i].id) ?? 0
    if (i < toasts.length - 1) total += props.gap
  }
  return total
})

const collapsedHeight = computed(() => {
  const visibleCount = Math.min(_toasts.value.length, props.visibleToasts)
  if (visibleCount <= 0) return 0

  let total = PH
  for (let i = 1; i < visibleCount; i++) {
    const toast = _toasts.value[_toasts.value.length - i]
    if (!toast) break
    total += getCollapsedContribution(toast.id)
  }
  return total
})

const containerStyle = computed(() => {
  const off = typeof props.offset === 'number' ? `${props.offset}px` : props.offset
  const style: Record<string, string> = {
    position: 'fixed',
    zIndex: '999999',
    listStyle: 'none',
    padding: '0',
    margin: '0',
    width: '356px',
    height: `${containerHovered.value ? expandedHeight.value : collapsedHeight.value}px`,
    pointerEvents: _toasts.value.length > 0 ? 'auto' : 'none',
  }

  if (isBottom.value) style.bottom = off
  else style.top = off

  if (props.position.endsWith('right')) style.right = off
  else if (props.position.endsWith('left')) style.left = off
  else {
    style.left = '50%'
    style.transform = 'translateX(-50%)'
  }

  return style
})

function computeLayoutState(index: number): LayoutState {
  const toasts = _toasts.value
  const total = toasts.length
  const indexFromFront = total - 1 - index
  const hovered = containerHovered.value

  let expandedOffset = 0
  let collapsedOffset = 0
  let hasExpandedLeader = false
  for (let i = total - 1; i > index; i--) {
    const leaderHeight = getMeasuredHeight(toasts[i].id)
    expandedOffset += leaderHeight + props.gap
    collapsedOffset += getCollapsedContribution(toasts[i].id)
    if (isExpandedHeight(leaderHeight)) hasExpandedLeader = true
  }

  const visible = indexFromFront < props.visibleToasts || hovered
  const direction = isBottom.value ? -1 : 1
  const useExpandedLayout = hovered
  const yOffset = direction * (useExpandedLayout ? expandedOffset : collapsedOffset)
  const scale = (useExpandedLayout || hasExpandedLeader)
    ? 1
    : Math.max(MIN_STACK_SCALE, 1 - (indexFromFront * COLLAPSED_SCALE_STEP))
  const collapsedOpacity = hasExpandedLeader
    ? 1
    : indexFromFront === 0
      ? 1
      : indexFromFront === 1
        ? 0.9
        : 0.82

  return {
    yOffset,
    scale,
    opacity: visible ? (useExpandedLayout ? 1 : collapsedOpacity) : 0,
  }
}

function applyDisplayedLayout(targets: Map<string | number, LayoutState>) {
  for (const id of Array.from(displayedLayout.keys())) {
    if (!targets.has(id)) displayedLayout.delete(id)
  }

  for (const [id, layout] of targets) {
    displayedLayout.set(id, layout)
  }
}

function getEntryStartLayout(id: string | number, target: LayoutState): LayoutState {
  const direction = isBottom.value ? -1 : 1
  // Sonner-style entry: slide in by the toast's own height (like translateY(100%)).
  // This ensures small toasts don't overshoot and tall toasts don't undershoot.
  const slideDistance = getMeasuredHeight(id)

  return {
    yOffset: target.yOffset - (direction * slideDistance),
    scale: target.scale,
    opacity: 0,
  }
}

async function syncDisplayedLayout() {
  const targets = new Map<string | number, LayoutState>()
  let hasExistingMovement = false
  let hasNewEntry = false

  _toasts.value.forEach((toast, index) => {
    const target = computeLayoutState(index)
    targets.set(toast.id, target)

    const current = displayedLayout.get(toast.id)
    if (!current) {
      // Every toast (including the very first) gets entry animation:
      // start off-screen with opacity 0, then animate to target position.
      displayedLayout.set(toast.id, getEntryStartLayout(toast.id, target))
      hasNewEntry = true
      return
    }

    if (
      current.yOffset !== target.yOffset ||
      current.scale !== target.scale ||
      current.opacity !== target.opacity
    ) {
      hasExistingMovement = true
    }
  })

  for (const id of Array.from(displayedLayout.keys())) {
    if (!targets.has(id)) displayedLayout.delete(id)
  }

  cancelPendingFrame()
  if (!hasExistingMovement && !hasNewEntry) {
    applyDisplayedLayout(targets)
    return
  }

  if (hasNewEntry) {
    // Wait for Vue to flush the entry start state (opacity 0, off-screen offset)
    // to the DOM. The watcher's flush:'post' only guarantees the *watched source*
    // is flushed, not mutations we made inside the callback.
    await nextTick()
    // Force synchronous reflow so the browser paints the start state
    // before we apply targets in the next frame.
    const el = containerRef.value
    if (el) void el.offsetHeight
  }

  pendingFrame = requestAnimationFrame(() => {
    applyDisplayedLayout(targets)
    pendingFrame = null
  })
}

watch(
  () => _toasts.value.map(toast => `${toast.id}:${toast._dismissRequested ? '1' : '0'}`).join('|'),
  () => {
    syncDisplayedLayout()
  },
  { flush: 'post', immediate: true },
)

watch(
  () => Array.from(heights.entries()).map(([id, height]) => `${id}:${height}`).join('|'),
  () => {
    syncDisplayedLayout()
  },
  { flush: 'post' },
)

watch(
  () => containerHovered.value,
  () => {
    syncDisplayedLayout()
  },
  { flush: 'post' },
)

onBeforeUnmount(() => {
  cancelPendingFrame()
})

function getItemStyle(index: number): Record<string, string> {
  const toasts = _toasts.value
  const total = toasts.length
  const indexFromFront = total - 1 - index
  const toastId = toasts[index].id
  const layout = displayedLayout.get(toastId) ?? computeLayoutState(index)

  return {
    position: 'absolute',
    ...(isBottom.value ? { bottom: '0' } : { top: '0' }),
    left: '0',
    right: '0',
    transform: `translate3d(0, ${layout.yOffset}px, 0) scale(${layout.scale})`,
    transformOrigin: isBottom.value ? 'bottom center' : 'top center',
    transition: 'transform 400ms, opacity 400ms, height 400ms',
    opacity: String(layout.opacity),
    zIndex: String(total - indexFromFront),
    pointerEvents: layout.opacity > 0 ? 'auto' : 'none',
    willChange: 'transform, opacity',
  }
}
</script>

<template>
  <Teleport to="body">
    <ol
      ref="containerRef"
      data-gooey-toaster
      :data-position="position"
      :data-theme="theme"
      :data-dir="dir"
      :style="containerStyle"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <li
        v-for="(toast, index) in _toasts"
        :key="toast.id"
        :style="getItemStyle(index)"
      >
        <ToastErrorBoundary>
          <GooeyToast
            :toast="toast"
            :toast-id="toast.id"
            @dismiss="handleDismiss"
            @height-change="handleHeightChange"
          />
        </ToastErrorBoundary>
      </li>
    </ol>
  </Teleport>
</template>
