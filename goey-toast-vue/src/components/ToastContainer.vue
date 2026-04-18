<script setup lang="ts">
import { computed, reactive } from 'vue'
import { _toasts, _onToastDismissed } from '../gooey-toast'
import { containerHovered } from '../context'
import type { ToastPosition } from '../types'
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

const heights = reactive(new Map<string | number, number>())

function handleHeightChange(id: string | number, height: number) {
  heights.set(id, height)
}

function handleDismiss(id: string | number) {
  heights.delete(id)
  _onToastDismissed(id)
}

function onMouseEnter() {
  containerHovered.value = true
}

function onMouseLeave() {
  containerHovered.value = false
}

const isBottom = computed(() => props.position.startsWith('bottom'))

const expandedHeight = computed(() => {
  let total = 0
  const toasts = _toasts.value
  for (let i = 0; i < toasts.length; i++) {
    total += heights.get(toasts[i].id) ?? 0
    if (i < toasts.length - 1) total += props.gap
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
    height: `${expandedHeight.value}px`,
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

function getItemStyle(index: number): Record<string, string> {
  const toasts = _toasts.value
  const total = toasts.length
  const indexFromFront = total - 1 - index
  const hovered = containerHovered.value

  let cumulativeOffset = 0
  for (let i = total - 1; i > index; i--) {
    cumulativeOffset += (heights.get(toasts[i].id) ?? 0) + props.gap
  }

  const visible = indexFromFront < props.visibleToasts || hovered
  const scale = hovered ? 1 : Math.max(0.8, 1 - indexFromFront * 0.05)
  const direction = isBottom.value ? -1 : 1
  const yOffset = direction * cumulativeOffset

  return {
    position: 'absolute',
    ...(isBottom.value ? { bottom: '0' } : { top: '0' }),
    left: '0',
    right: '0',
    transform: `translate3d(0, ${yOffset}px, 0) scale(${scale})`,
    transformOrigin: isBottom.value ? 'bottom center' : 'top center',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    opacity: visible ? '1' : '0',
    zIndex: String(total - indexFromFront),
    pointerEvents: visible ? 'auto' : 'none',
  }
}
</script>

<template>
  <Teleport to="body">
    <ol
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
