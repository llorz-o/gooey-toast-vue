import type { VNode } from 'vue'
import type { AnimationPresetName } from './presets'

export type GooeyToastType = 'default' | 'success' | 'error' | 'warning' | 'info'

export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface GooeyToastTimings {
  displayDuration?: number
}

export interface GooeyToastClassNames {
  wrapper?: string
  content?: string
  header?: string
  title?: string
  icon?: string
  description?: string
  actionWrapper?: string
  actionButton?: string
}

export interface GooeyToastAction {
  label: string
  onClick: () => void
  successLabel?: string
}

export interface GooeyToastData {
  title: string
  description?: VNode | string
  type: GooeyToastType
  action?: GooeyToastAction
  icon?: VNode | string
  duration?: number
  classNames?: GooeyToastClassNames
  fillColor?: string
  borderColor?: string
  borderWidth?: number
  preset?: AnimationPresetName
  spring?: boolean
  bounce?: number
  showTimestamp?: boolean
}

export interface GooeyToastOptions {
  description?: VNode | string
  action?: GooeyToastAction
  icon?: VNode | string
  duration?: number
  id?: string | number
  classNames?: GooeyToastClassNames
  fillColor?: string
  borderColor?: string
  borderWidth?: number
  timing?: GooeyToastTimings
  preset?: AnimationPresetName
  spring?: boolean
  bounce?: number
  showProgress?: boolean
  showTimestamp?: boolean
  onDismiss?: (id: string | number) => void
  onAutoClose?: (id: string | number) => void
}

export interface GooeyPromiseData<T> {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((error: unknown) => string)
  description?: {
    loading?: VNode | string
    success?: VNode | string | ((data: T) => VNode | string)
    error?: VNode | string | ((error: unknown) => VNode | string)
  }
  action?: {
    success?: GooeyToastAction
    error?: GooeyToastAction
  }
  classNames?: GooeyToastClassNames
  fillColor?: string
  borderColor?: string
  borderWidth?: number
  timing?: GooeyToastTimings
  preset?: AnimationPresetName
  spring?: boolean
  bounce?: number
  showTimestamp?: boolean
  onDismiss?: (id: string | number) => void
  onAutoClose?: (id: string | number) => void
}

export type GooeyToastPhase = 'loading' | 'default' | 'success' | 'error' | 'warning' | 'info'

export interface GooeyToastUpdateOptions {
  title?: string
  description?: VNode | string
  type?: GooeyToastType
  action?: GooeyToastAction
  icon?: VNode | string | null
  showTimestamp?: boolean
}

export interface DismissFilter {
  type: GooeyToastType | GooeyToastType[]
}

export interface GooeyToasterProps {
  position?: ToastPosition
  duration?: number
  gap?: number
  offset?: number | string
  theme?: 'light' | 'dark'
  closeButton?: boolean | 'top-left' | 'top-right'
  visibleToasts?: number
  dir?: 'ltr' | 'rtl'
  preset?: AnimationPresetName
  spring?: boolean
  bounce?: number
  swipeToDismiss?: boolean
  closeOnEscape?: boolean
  maxQueue?: number
  queueOverflow?: 'drop-oldest' | 'drop-newest'
  showProgress?: boolean
}
