import { reactive, ref } from 'vue'
import type { ToastPosition } from './types'

export const _config = reactive({
  position: 'bottom-right' as ToastPosition,
  dir: 'ltr' as 'ltr' | 'rtl',
  spring: true,
  bounce: undefined as number | undefined,
  theme: 'light' as 'light' | 'dark',
  visibleToasts: 3,
  swipeToDismiss: true,
  closeOnEscape: true,
  maxQueue: Infinity,
  queueOverflow: 'drop-oldest' as 'drop-oldest' | 'drop-newest',
  showProgress: false,
  closeButton: false as boolean | 'top-left' | 'top-right',
})

export const containerHovered = ref(false)

export type AriaLivePoliteness = 'polite' | 'assertive'

export interface Announcement {
  message: string
  politeness: AriaLivePoliteness
}

export const _announcement = ref<Announcement | null>(null)

export function announce(message: string, politeness: AriaLivePoliteness = 'polite') {
  _announcement.value = null
  queueMicrotask(() => {
    _announcement.value = { message, politeness }
  })
}
