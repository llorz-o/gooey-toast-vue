<script setup lang="ts">
import { computed, onMounted, onUnmounted, watchEffect } from 'vue'
import { _config } from '../context'
import { _getMostRecentActiveId, gooeyToast } from '../gooey-toast'
import { animationPresets } from '../presets'
import type { GooeyToasterProps } from '../types'
import AriaLiveAnnouncer from './AriaLiveAnnouncer.vue'
import ToastContainer from './ToastContainer.vue'

const props = withDefaults(defineProps<GooeyToasterProps>(), {
  position: 'bottom-right',
  gap: 14,
  offset: '24px',
  theme: 'light',
  dir: 'ltr',
  visibleToasts: 3,
  swipeToDismiss: true,
  closeOnEscape: true,
  maxQueue: Infinity,
  queueOverflow: 'drop-oldest',
  showProgress: false,
  closeButton: false,
})

const presetConfig = computed(() => props.preset ? animationPresets[props.preset] : undefined)
const resolvedSpring = computed(() => props.spring ?? presetConfig.value?.spring ?? true)
const resolvedBounce = computed(() => props.bounce ?? presetConfig.value?.bounce)

watchEffect(() => {
  _config.position = props.position
  _config.dir = props.dir
  _config.theme = props.theme
  _config.spring = resolvedSpring.value
  _config.bounce = resolvedBounce.value
  _config.visibleToasts = props.visibleToasts
  _config.swipeToDismiss = props.swipeToDismiss
  _config.closeOnEscape = props.closeOnEscape
  _config.maxQueue = props.maxQueue
  _config.queueOverflow = props.queueOverflow
  _config.showProgress = props.showProgress
  _config.closeButton = props.closeButton
})

function handleKeyDown(event: KeyboardEvent) {
  if (!_config.closeOnEscape || event.key !== 'Escape') return

  const recentId = _getMostRecentActiveId()
  if (recentId != null) {
    gooeyToast.dismiss(recentId)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)

  if (!import.meta.env.DEV) return

  const el = document.createElement('div')
  el.setAttribute('data-gooey-toast-css', '')
  el.style.position = 'absolute'
  el.style.width = '0'
  el.style.height = '0'
  el.style.overflow = 'hidden'
  el.style.pointerEvents = 'none'
  document.body.appendChild(el)

  const value = getComputedStyle(el).getPropertyValue('--gooey-toast').trim()
  document.body.removeChild(el)

  if (!value) {
    console.warn(
      '[gooey-toast] Styles not found. Make sure to import the CSS:\n\n' +
      '  import "goey-toast/styles.css";\n',
    )
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <ToastContainer
    :position="props.position"
    :gap="props.gap"
    :offset="props.offset"
    :theme="props.theme"
    :dir="props.dir"
    :visible-toasts="props.visibleToasts"
  />
  <AriaLiveAnnouncer />
</template>
