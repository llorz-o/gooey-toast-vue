import './gooey-toast.css'

import GooeyToaster from './components/GooeyToaster.vue'

export { GooeyToaster }
export { gooeyToast } from './gooey-toast'
export { animationPresets } from './presets'
export type { AnimationPreset, AnimationPresetName } from './presets'
export type {
  GooeyToastOptions,
  GooeyPromiseData,
  GooeyToasterProps,
  GooeyToastAction,
  GooeyToastClassNames,
  GooeyToastTimings,
  GooeyToastUpdateOptions,
  DismissFilter,
} from './types'

// Backward-compatible aliases
export { GooeyToaster as GoeyToaster }
export { gooeyToast as goeyToast } from './gooey-toast'
export type { GooeyPromiseData as GoeyPromiseData } from './types'
export type { GooeyToastClassNames as GoeyToastClassNames } from './types'
export type { GooeyToastTimings as GoeyToastTimings } from './types'
export type { GooeyToastOptions as GoeyToastOptions } from './types'
export type { GooeyToasterProps as GoeyToasterProps } from './types'
