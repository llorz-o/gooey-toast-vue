import { ref, readonly, type Ref } from 'vue'
import { _config } from '../context'

const SWIPE_THRESHOLD = 100

export interface UseSwipeToDismissOptions {
  onDismiss: () => void
}

export interface UseSwipeToDismissReturn {
  offsetX: Readonly<Ref<number>>
  opacity: Readonly<Ref<number>>
  swiping: Readonly<Ref<boolean>>
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: () => void
}

export function useSwipeToDismiss(options: UseSwipeToDismissOptions): UseSwipeToDismissReturn {
  const offsetX = ref(0)
  const opacity = ref(1)
  const swiping = ref(false)

  let startPos: { x: number; y: number } | null = null
  let locked = false

  function onTouchStart(e: TouchEvent) {
    if (!_config.swipeToDismiss) return
    const touch = e.touches[0]
    startPos = { x: touch.clientX, y: touch.clientY }
    locked = false
  }

  function onTouchMove(e: TouchEvent) {
    if (!startPos || !_config.swipeToDismiss) return
    const touch = e.touches[0]
    const dx = touch.clientX - startPos.x
    const dy = touch.clientY - startPos.y

    if (!locked && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
      startPos = null
      return
    }

    if (!locked && Math.abs(dx) > 10) {
      locked = true
    }

    if (locked) {
      swiping.value = true
      offsetX.value = dx
      opacity.value = Math.max(0, 1 - Math.abs(dx) / (SWIPE_THRESHOLD * 1.5))
    }
  }

  function onTouchEnd() {
    if (!_config.swipeToDismiss) {
      startPos = null
      return
    }
    if (locked && Math.abs(offsetX.value) >= SWIPE_THRESHOLD) {
      options.onDismiss()
    }
    startPos = null
    locked = false
    swiping.value = false
    offsetX.value = 0
    opacity.value = 1
  }

  return {
    offsetX: readonly(offsetX),
    opacity: readonly(opacity),
    swiping: readonly(swiping),
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
