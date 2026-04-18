<script setup lang="ts">
import { animate, type AnimationPlaybackControls } from 'motion'
import {
  computed,
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type CSSProperties,
  type VNode,
} from 'vue'
import DefaultIcon from '../icons/DefaultIcon.vue'
import ErrorIcon from '../icons/ErrorIcon.vue'
import InfoIcon from '../icons/InfoIcon.vue'
import SpinnerIcon from '../icons/SpinnerIcon.vue'
import SuccessIcon from '../icons/SuccessIcon.vue'
import WarningIcon from '../icons/WarningIcon.vue'
import { _config, containerHovered } from '../context'
import { _markAutoClose, type InternalToast } from '../gooey-toast'
import { morphPath, morphPathCenter, PH } from '../morph'
import { animationPresets } from '../presets'
import { DEFAULT_COLLAPSE_DUR, DEFAULT_EXPAND_DUR, SMOOTH_EASE, squishSpring } from '../spring'
import type { GooeyToastPhase } from '../types'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'
import { useSwipeToDismiss } from '../composables/useSwipeToDismiss'
import { useToastTimer } from '../composables/useToastTimer'
import { styles } from './gooey-styles'

const DEFAULT_DISPLAY_DURATION = 4000
const SQUISH_DELAY_MS = 45

const props = defineProps<{
  toast: InternalToast
  toastId: string | number
}>()

const emit = defineEmits<{
  dismiss: [id: string | number]
  heightChange: [id: string | number, height: number]
}>()

const VNodeRenderer = defineComponent({
  name: 'VNodeRenderer',
  props: { content: { required: true as const } },
  setup(rendererProps) {
    return () => {
      const content = rendererProps.content as string | VNode
      return typeof content === 'string' ? h('span', content) : content
    }
  },
})

const phaseIconMap = {
  default: DefaultIcon,
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
} as const

const titleColorMap: Record<GooeyToastPhase, string> = {
  loading: styles.titleLoading,
  default: styles.titleDefault,
  success: styles.titleSuccess,
  error: styles.titleError,
  warning: styles.titleWarning,
  info: styles.titleInfo,
}

const actionColorMap: Record<GooeyToastPhase, string> = {
  loading: styles.actionInfo,
  default: styles.actionDefault,
  success: styles.actionSuccess,
  error: styles.actionError,
  warning: styles.actionWarning,
  info: styles.actionInfo,
}

const progressColorMap: Record<GooeyToastPhase, string> = {
  loading: styles.progressInfo,
  default: styles.progressDefault,
  success: styles.progressSuccess,
  error: styles.progressError,
  warning: styles.progressWarning,
  info: styles.progressInfo,
}

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ')
}

const actionSuccess = ref<string | null>(null)
const dismissing = ref(false)
const progressKey = ref(0)
const hovered = ref(false)
const showBody = ref(false)
const dims = ref({ pw: 0, bw: 0, th: 0 })

const wrapperRef = ref<HTMLDivElement | null>(null)
const pathRef = ref<SVGPathElement | null>(null)
const headerRef = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)

let morphT = 0
let aDims = { pw: 0, bw: 0, th: 0 }
let dimsSnapshot = { pw: 0, bw: 0, th: 0 }
let expandedDims = { pw: 0, bw: 0, th: 0 }
let isCollapsing = false
let isPreDismissing = false
let collapseEndTime = 0
let hoveredSync = false
let lastSquishTime = 0
let mountSquished = false
let prevShowBody = false
let reExpanding = false
let morphCtrl: AnimationPlaybackControls | null = null
let pillResizeCtrl: AnimationPlaybackControls | null = null
let headerSquishCtrl: AnimationPlaybackControls | null = null
let blobSquishCtrl: AnimationPlaybackControls | null = null
let shakeCtrl: AnimationPlaybackControls | null = null
let headerSquished = false
let prevPhase = props.toast.phase

let wrapperResizeObserver: ResizeObserver | null = null
let contentResizeObserver: ResizeObserver | null = null

const prefersReducedMotion = usePrefersReducedMotion()

const theme = computed(() => _config.theme)
const position = computed(() => _config.position)
const isCenter = computed(() => position.value.includes('center'))
const posIsRight = computed(() => position.value.includes('right'))
const isRight = computed(() => _config.dir === 'rtl'
  ? (isCenter.value ? false : !posIsRight.value)
  : posIsRight.value)
const closeButtonSetting = computed(() => _config.closeButton)
const showCloseButton = computed(() => closeButtonSetting.value !== false)
const fillColor = computed(() => props.toast.fillColor ?? (theme.value === 'dark' ? '#1a1a1a' : '#ffffff'))
const presetConfig = computed(() => props.toast.preset ? animationPresets[props.toast.preset] : undefined)
const useSpring = computed(() => props.toast.spring ?? presetConfig.value?.spring ?? _config.spring)
const bounceVal = computed(() => props.toast.bounce ?? presetConfig.value?.bounce ?? _config.bounce ?? 0.4)
const showProgress = computed(() => props.toast.showProgress ?? _config.showProgress)
const effectiveTitle = computed(() => actionSuccess.value ?? props.toast.title)
const effectivePhase = computed<GooeyToastPhase>(() => actionSuccess.value ? 'success' : props.toast.phase)
const effectiveDescription = computed(() => actionSuccess.value ? undefined : props.toast.description)
const effectiveAction = computed(() => actionSuccess.value ? undefined : props.toast.action)
const isLoading = computed(() => effectivePhase.value === 'loading')
const hasDescription = computed(() => Boolean(effectiveDescription.value))
const hasAction = computed(() => Boolean(effectiveAction.value))
const canExpand = computed(() => hasDescription.value || hasAction.value)
const isExpanded = computed(() => canExpand.value && !dismissing.value)
const hasDims = computed(() => dims.value.pw > 0 && dims.value.bw > 0 && dims.value.th > 0)
const expandDelayMs = computed(() => prefersReducedMotion.value ? 0 : 330)
const collapseMs = computed(() => prefersReducedMotion.value ? 10 : 900)
const timerEnabled = computed(() => showBody.value && !actionSuccess.value && !dismissing.value)
const timerPaused = computed(() => hovered.value || containerHovered.value)
const toastDuration = computed(() => props.toast.timing?.displayDuration ?? props.toast.duration)
const phaseIconComponent = computed(() => phaseIconMap[effectivePhase.value === 'loading' ? 'info' : effectivePhase.value])
const iconTransitionKey = computed(() => isLoading.value ? 'spinner' : effectivePhase.value)
const createdAt = new Date()
const timestampStr = createdAt.toLocaleTimeString(undefined, {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
})

const wrapperStyle = computed<CSSProperties | undefined>(() => {
  const base: CSSProperties = {}
  if (isCenter.value) base.margin = '0 auto'
  else if (isRight.value) {
    base.marginLeft = 'auto'
    base.transform = 'scaleX(-1)'
  }

  if (swipe.offsetX.value !== 0) {
    return {
      ...base,
      transform: `${base.transform ? `${base.transform} ` : ''}translateX(${swipe.offsetX.value}px)`,
      opacity: swipe.opacity.value,
      transition: 'none',
    }
  }

  return Object.keys(base).length > 0 ? base : undefined
})

const contentStyle = computed<CSSProperties>(() => {
  if (isCenter.value) return { textAlign: 'center' }
  if (isRight.value) return { transform: 'scaleX(-1)', textAlign: 'right' }
  return { textAlign: 'left' }
})

const progressBarStyle = computed(() => ({
  '--gooey-progress-duration': `${progressDuration.value || (toastDuration.value ?? DEFAULT_DISPLAY_DURATION)}ms`,
}) as CSSProperties)

const closeButtonClass = computed(() => cx(
  styles.closeButton,
  (isRight.value ? closeButtonSetting.value !== 'top-right' : closeButtonSetting.value === 'top-right') && styles.closeButtonRight,
))

const closeButtonStyle = computed<CSSProperties>(() => ({
  background: fillColor.value,
  borderColor: props.toast.borderColor || 'transparent',
  borderWidth: props.toast.borderColor ? (props.toast.borderWidth ?? 1.5) : 0,
  boxShadow: props.toast.borderColor ? 'none' : '0 1px 4px rgba(0, 0, 0, 0.2)',
  ...(isCenter.value && closeButtonSetting.value !== 'top-right' ? { top: '6px', left: '-1px' } : {}),
}))

const swipe = useSwipeToDismiss({
  onDismiss: () => emit('dismiss', props.toastId),
})

function stopAnimations() {
  morphCtrl?.stop()
  pillResizeCtrl?.stop()
  headerSquishCtrl?.stop()
  blobSquishCtrl?.stop()
  shakeCtrl?.stop()
}

function flush() {
  const { pw: p, bw: b, th: h } = aDims
  if (p <= 0 || b <= 0 || h <= 0) return

  const t = Math.max(0, Math.min(1, morphT))
  const centerPos = position.value.includes('center')
  const positionRight = position.value.includes('right')
  const rightSide = _config.dir === 'rtl' ? (centerPos ? false : !positionRight) : positionRight

  if (centerPos) {
    const centerBw = Math.max(dimsSnapshot.bw, expandedDims.bw, p)
    pathRef.value?.setAttribute('d', morphPathCenter(p, centerBw, h, t))
  } else {
    pathRef.value?.setAttribute('d', morphPath(p, b, h, t))
  }

  if (t >= 1) {
    if (wrapperRef.value) {
      wrapperRef.value.style.width = ''
    }
    if (contentRef.value) {
      contentRef.value.style.width = ''
      contentRef.value.style.overflow = ''
      contentRef.value.style.maxHeight = ''
      contentRef.value.style.clipPath = ''
    }
  } else if (t > 0) {
    const targetBw = dimsSnapshot.bw
    const targetTh = dimsSnapshot.th
    const pillW = Math.min(p, b)
    const currentW = pillW + (b - pillW) * t
    const currentH = PH + (targetTh - PH) * t
    const centerFullW = centerPos ? Math.max(dimsSnapshot.bw, expandedDims.bw, p) : 0

    if (wrapperRef.value) {
      wrapperRef.value.style.width = `${centerPos ? centerFullW : currentW}px`
    }

    if (contentRef.value) {
      contentRef.value.style.width = `${centerPos ? centerFullW : targetBw}px`
      contentRef.value.style.overflow = 'hidden'
      contentRef.value.style.maxHeight = `${currentH}px`
      if (centerPos) {
        const clip = (centerFullW - currentW) / 2
        contentRef.value.style.clipPath = `inset(0 ${clip}px 0 ${clip}px)`
      } else {
        const clip = targetBw - currentW
        contentRef.value.style.clipPath = rightSide
          ? `inset(0 0 0 ${clip}px)`
          : `inset(0 ${clip}px 0 0)`
      }
    }
  } else {
    const pillW = Math.min(p, b)
    if (wrapperRef.value) {
      const centerBw = centerPos ? Math.max(dimsSnapshot.bw, expandedDims.bw, p) : pillW
      wrapperRef.value.style.width = `${centerBw}px`
    }

    if (contentRef.value) {
      if (centerPos) {
        const centerBwVal = Math.max(dimsSnapshot.bw, expandedDims.bw, p)
        contentRef.value.style.width = `${centerBwVal}px`
        const clip = (centerBwVal - pillW) / 2
        contentRef.value.style.clipPath = `inset(0 ${clip}px 0 ${clip}px)`
      } else {
        contentRef.value.style.width = ''
        contentRef.value.style.clipPath = ''
      }
      contentRef.value.style.overflow = 'hidden'
      contentRef.value.style.maxHeight = `${PH}px`
    }
  }
}

function measure() {
  if (!headerRef.value || !contentRef.value) return

  const wrapper = wrapperRef.value
  const savedW = wrapper?.style.width ?? ''
  const savedOv = contentRef.value.style.overflow
  const savedMH = contentRef.value.style.maxHeight
  const savedCW = contentRef.value.style.width

  if (wrapper) wrapper.style.width = ''
  contentRef.value.style.overflow = ''
  contentRef.value.style.maxHeight = ''
  contentRef.value.style.width = ''

  const cs = getComputedStyle(contentRef.value)
  const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
  const pw = headerRef.value.offsetWidth + paddingX
  const bw = contentRef.value.offsetWidth
  const th = contentRef.value.offsetHeight

  if (wrapper) wrapper.style.width = savedW
  contentRef.value.style.overflow = savedOv
  contentRef.value.style.maxHeight = savedMH
  contentRef.value.style.width = savedCW

  dimsSnapshot = { pw, bw, th }
  dims.value = { pw, bw, th }
}

function triggerLandingSquish(phase: 'expand' | 'collapse' | 'mount' = 'mount') {
  if (!wrapperRef.value || prefersReducedMotion.value || !useSpring.value) return

  const now = Date.now()
  if (now - lastSquishTime < 300) return
  lastSquishTime = now

  blobSquishCtrl?.stop()

  const el = wrapperRef.value
  const springConfig = phase === 'collapse'
    ? squishSpring(DEFAULT_COLLAPSE_DUR, DEFAULT_COLLAPSE_DUR, bounceVal.value)
    : squishSpring(DEFAULT_EXPAND_DUR, DEFAULT_EXPAND_DUR, bounceVal.value)
  const bScale = bounceVal.value / 0.4
  const compressY = (phase === 'collapse' ? 0.035 : 0.12) * bScale
  const expandX = (phase === 'collapse' ? 0.018 : 0.06) * bScale

  blobSquishCtrl = animate(0, 1, {
    ...springConfig,
    onUpdate: (v) => {
      const intensity = Math.sin(v * Math.PI)
      const sy = 1 - compressY * intensity
      const sx = 1 + expandX * intensity
      const mirror = el.style.transform.includes('scaleX(-1)') ? 'scaleX(-1) ' : ''
      el.style.transformOrigin = 'center top'
      el.style.transform = `${mirror}scaleX(${sx}) scaleY(${sy})`
    },
    onComplete: () => {
      const right = el.style.transform.includes('scaleX(-1)')
      el.style.transform = right ? 'scaleX(-1)' : ''
      el.style.transformOrigin = ''
    },
  })
}

const { progressDuration, restart: restartTimer } = useToastTimer({
  duration: toastDuration,
  expandDelayMs,
  collapseMs,
  paused: timerPaused,
  enabled: timerEnabled,
  onTimeout: () => {
    if (hoveredSync || containerHovered.value) return
    expandedDims = { ...aDims }
    isCollapsing = true
    isPreDismissing = true
    dismissing.value = true
    _markAutoClose(props.toastId)
  },
})

function handleMouseEnter() {
  hoveredSync = true
  hovered.value = true
}

function handleMouseLeave() {
  hoveredSync = false
  hovered.value = false
}

function handleActionClick() {
  const action = effectiveAction.value
  if (!action) return

  if (action.successLabel) {
    expandedDims = { ...aDims }
    isCollapsing = true
    actionSuccess.value = action.successLabel
  }

  try {
    action.onClick()
  } catch {
    // action errors must not block collapse animation
  }
}

function handleCloseClick(event: MouseEvent) {
  event.stopPropagation()
  emit('dismiss', props.toastId)
}

onMounted(() => {
  measure()
  window.setTimeout(measure, 100)

  if (wrapperRef.value) {
    wrapperResizeObserver = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height
      if (height && height > 0) emit('heightChange', props.toastId, height)
    })
    wrapperResizeObserver.observe(wrapperRef.value)
  }

  if (contentRef.value) {
    contentResizeObserver = new ResizeObserver(() => {
      measure()
    })
    contentResizeObserver.observe(contentRef.value)
  }
})

onUnmounted(() => {
  stopAnimations()
  wrapperResizeObserver?.disconnect()
  contentResizeObserver?.disconnect()
})

watch(
  [effectiveTitle, effectivePhase, isExpanded, showBody, effectiveDescription, effectiveAction],
  (
    _value,
    _oldValue,
    onCleanup: (cleanupFn: () => void) => void,
  ) => {
    measure()
    const timer = window.setTimeout(measure, 100)
    onCleanup(() => clearTimeout(timer))
  },
  { flush: 'pre' },
)

watch(
  [() => dims.value.pw, () => dims.value.bw, () => dims.value.th, hasDims, showBody, prefersReducedMotion, useSpring, bounceVal, isExpanded],
  (
    [pw, bw, th, dimsReady, bodyVisible, reducedMotion, springEnabled, bounce, expanded]: [number, number, number, boolean, boolean, boolean, boolean, number, boolean],
    _oldValue,
    onCleanup: (cleanupFn: () => void) => void,
  ) => {
    if (!dimsReady || isCollapsing) return

    const prev = { ...aDims }
    const target = { pw, bw, th }

    if (prev.bw <= 0) {
      aDims = target
      flush()
      return
    }

    if (morphT > 0 && morphT < 1) {
      aDims = target
      flush()
      return
    }

    if (bodyVisible) {
      aDims = target
      flush()
      return
    }

    if (prev.bw === target.bw && prev.pw === target.pw && prev.th === target.th) return

    if (reducedMotion) {
      aDims = target
      flush()
      return
    }

    pillResizeCtrl?.stop()

    if (Date.now() - collapseEndTime > 500 && !expanded) {
      triggerLandingSquish('expand')
    }

    const transition = springEnabled
      ? { type: 'spring' as const, duration: 0.5, bounce: bounce * 0.875 }
      : { duration: 0.4, ease: SMOOTH_EASE }

    pillResizeCtrl = animate(0, 1, {
      ...transition,
      onUpdate: (t) => {
        aDims = {
          pw: prev.pw + (target.pw - prev.pw) * t,
          bw: prev.bw + (target.bw - prev.bw) * t,
          th: prev.th + (target.th - prev.th) * t,
        }
        flush()
      },
    })

    onCleanup(() => {
      pillResizeCtrl?.stop()
    })
  },
  { flush: 'pre' },
)

watch(
  [hasDims, isExpanded],
  (
    [dimsReady, expanded]: [boolean, boolean],
    _oldValue,
    onCleanup: (cleanupFn: () => void) => void,
  ) => {
    if (!dimsReady || mountSquished || expanded) return
    mountSquished = true
    const timer = window.setTimeout(() => triggerLandingSquish('mount'), SQUISH_DELAY_MS)
    onCleanup(() => clearTimeout(timer))
  },
  { immediate: true },
)

watch(
  showBody,
  (
    bodyVisible: boolean,
    _oldValue,
    onCleanup: (cleanupFn: () => void) => void,
  ) => {
    if (!prevShowBody && bodyVisible && !hoveredSync) {
      const timer = window.setTimeout(() => triggerLandingSquish('expand'), 80)
      onCleanup(() => clearTimeout(timer))
    }
    prevShowBody = bodyVisible
  },
  { flush: 'pre' },
)

watch(
  () => props.toast.phase,
  (phase: GooeyToastPhase) => {
    if (phase === 'error' && prevPhase !== 'error' && !dismissing.value && wrapperRef.value && !prefersReducedMotion.value) {
      shakeCtrl?.stop()
      const el = wrapperRef.value
      const mirror = el.style.transform.includes('scaleX(-1)') ? 'scaleX(-1) ' : ''
      shakeCtrl = animate(0, 1, {
        duration: 0.4,
        ease: 'easeOut',
        onUpdate: (v) => {
          const decay = 1 - v
          const shake = Math.sin(v * Math.PI * 6) * decay * 3
          el.style.transform = `${mirror}translateX(${shake}px)`
        },
        onComplete: () => {
          el.style.transform = mirror.trim()
        },
      })
    }

    prevPhase = phase
  },
)

watch(
  isExpanded,
  (
    expanded: boolean,
    _oldValue,
    onCleanup: (cleanupFn: () => void) => void,
  ) => {
    if (expanded) {
      const timer = window.setTimeout(() => {
        showBody.value = true
      }, expandDelayMs.value)
      onCleanup(() => clearTimeout(timer))
      return
    }

    morphCtrl?.stop()
    pillResizeCtrl?.stop()

    if (morphT > 0) {
      const padStyles = contentRef.value ? getComputedStyle(contentRef.value) : null
      const padX = padStyles ? parseFloat(padStyles.paddingLeft) + parseFloat(padStyles.paddingRight) : 20
      const targetPw = headerRef.value ? headerRef.value.offsetWidth + padX : aDims.pw
      const targetDims = { pw: targetPw, bw: targetPw, th: PH }

      if (prefersReducedMotion.value) {
        morphT = 0
        isCollapsing = false
        isPreDismissing = false
        showBody.value = false
        aDims = { ...targetDims }
        flush()
        return
      }

      const savedDims = expandedDims.bw > 0 ? { ...expandedDims } : { ...aDims }
      const collapseTransition = (isPreDismissing || !useSpring.value)
        ? { duration: DEFAULT_COLLAPSE_DUR, ease: SMOOTH_EASE }
        : { type: 'spring' as const, duration: DEFAULT_COLLAPSE_DUR, bounce: bounceVal.value * 0.875 }

      triggerLandingSquish('collapse')

      morphCtrl = animate(morphT, 0, {
        ...collapseTransition,
        onUpdate: (t) => {
          morphT = t
          aDims = {
            pw: targetDims.pw + (savedDims.pw - targetDims.pw) * t,
            bw: targetDims.bw + (savedDims.bw - targetDims.bw) * t,
            th: targetDims.th + (savedDims.th - targetDims.th) * t,
          }
          flush()
        },
        onComplete: () => {
          morphT = 0
          isCollapsing = false
          isPreDismissing = false
          collapseEndTime = Date.now()
          aDims = { ...targetDims }
          flush()
          showBody.value = false
        },
      })

      onCleanup(() => morphCtrl?.stop())
      return
    }

    showBody.value = false
    morphT = 0
    flush()
  },
  { flush: 'post' },
)

watch(
  [hovered, containerHovered, canExpand, dismissing],
  (
    [isHovered, containerIsHovered, expandable, isDismissing]: [boolean, boolean, boolean, boolean],
    _oldValue,
    onCleanup: (cleanupFn: () => void) => void,
  ) => {
    if ((!isHovered && !containerIsHovered) || !expandable || !isDismissing) return

    morphCtrl?.stop()
    isCollapsing = false
    isPreDismissing = false
    reExpanding = true
    dismissing.value = false
    showBody.value = true
    restartTimer()

    if (showProgress.value) {
      progressKey.value += 1
    }

    const currentT = morphT
    const startDims = { ...aDims }
    let rafId = 0

    rafId = requestAnimationFrame(() => {
      measure()
      const transition = useSpring.value
        ? { type: 'spring' as const, duration: 0.9, bounce: bounceVal.value }
        : { duration: 0.6, ease: SMOOTH_EASE }

      morphCtrl = animate(currentT, 1, {
        ...transition,
        onUpdate: (t) => {
          morphT = t
          const target = dimsSnapshot
          aDims = {
            pw: startDims.pw + (target.pw - startDims.pw) * t,
            bw: startDims.bw + (target.bw - startDims.bw) * t,
            th: startDims.th + (target.th - startDims.th) * t,
          }
          flush()
        },
        onComplete: () => {
          morphT = 1
          aDims = { ...dimsSnapshot }
          reExpanding = false
          flush()
        },
      })
    })

    onCleanup(() => {
      cancelAnimationFrame(rafId)
      morphCtrl?.stop()
    })
  },
  { flush: 'post' },
)

watch(
  [dismissing, showBody],
  (
    [isDismissing, bodyVisible]: [boolean, boolean],
    _oldValue,
    onCleanup: (cleanupFn: () => void) => void,
  ) => {
    if (!isDismissing || bodyVisible) return
    const timer = window.setTimeout(() => {
      if (!hoveredSync && !containerHovered.value) emit('dismiss', props.toastId)
    }, 800)
    onCleanup(() => clearTimeout(timer))
  },
  { flush: 'post' },
)

watch(
  [actionSuccess, showBody],
  (
    [successLabel, bodyVisible]: [string | null, boolean],
    _oldValue,
    onCleanup: (cleanupFn: () => void) => void,
  ) => {
    if (!successLabel || bodyVisible) return
    const timer = window.setTimeout(() => {
      emit('dismiss', props.toastId)
    }, 1200)
    onCleanup(() => clearTimeout(timer))
  },
  { flush: 'post' },
)

watch(
  showBody,
  (
    bodyVisible: boolean,
    _oldValue,
    onCleanup: (cleanupFn: () => void) => void,
  ) => {
    if (reExpanding) return

    if (!bodyVisible) {
      morphT = 0
      morphCtrl?.stop()
      flush()
      return
    }

    if (prefersReducedMotion.value) {
      pillResizeCtrl?.stop()
      morphCtrl?.stop()
      morphT = 1
      aDims = { ...dimsSnapshot }
      flush()
      return
    }

    let rafId = 0

    rafId = requestAnimationFrame(() => {
      measure()
      pillResizeCtrl?.stop()
      morphCtrl?.stop()
      const startDims = { ...aDims }
      const transition = useSpring.value
        ? { type: 'spring' as const, duration: 0.9, bounce: bounceVal.value }
        : { duration: 0.6, ease: SMOOTH_EASE }

      morphCtrl = animate(0, 1, {
        ...transition,
        onUpdate: (t) => {
          morphT = t
          const target = dimsSnapshot
          aDims = {
            pw: startDims.pw + (target.pw - startDims.pw) * t,
            bw: startDims.bw + (target.bw - startDims.bw) * t,
            th: startDims.th + (target.th - startDims.th) * t,
          }
          flush()
        },
        onComplete: () => {
          morphT = 1
          aDims = { ...dimsSnapshot }
          flush()
        },
      })
    })

    onCleanup(() => {
      cancelAnimationFrame(rafId)
      morphCtrl?.stop()
    })
  },
  { flush: 'post' },
)

watch(
  [showBody, dismissing, actionSuccess, prefersReducedMotion, useSpring, bounceVal],
  (
    [bodyVisible, isDismissing, successLabel, reducedMotion, springEnabled, bounce]: [boolean, boolean, string | null, boolean, boolean, number],
    _oldValue,
    onCleanup: (cleanupFn: () => void) => void,
  ) => {
    if (!headerRef.value || reducedMotion) return

    headerSquishCtrl?.stop()
    const el = headerRef.value

    if (bodyVisible && !isDismissing && !successLabel) {
      if (!springEnabled) return
      headerSquished = true
      headerSquishCtrl = animate(0, 1, {
        ...squishSpring(DEFAULT_EXPAND_DUR, DEFAULT_EXPAND_DUR, bounce),
        onUpdate: (v) => {
          const scale = 1 - 0.05 * v
          const pushY = v * 1
          el.style.transform = `scale(${scale}) translateY(${pushY}px)`
        },
      })
    } else if (headerSquished) {
      headerSquished = false
      const transition = !isPreDismissing && springEnabled
        ? squishSpring(DEFAULT_COLLAPSE_DUR, DEFAULT_COLLAPSE_DUR, bounce)
        : { duration: DEFAULT_COLLAPSE_DUR * 0.5, ease: SMOOTH_EASE }
      headerSquishCtrl = animate(1, 0, {
        ...transition,
        onUpdate: (v) => {
          const scale = 1 - 0.05 * v
          const pushY = v * 1
          el.style.transform = `scale(${scale}) translateY(${pushY}px)`
        },
        onComplete: () => {
          el.style.transform = ''
        },
      })
    }

    onCleanup(() => headerSquishCtrl?.stop())
  },
  { flush: 'post' },
)
</script>

<template>
  <div
    ref="wrapperRef"
    :class="cx(styles.wrapper, toast.classNames?.wrapper)"
    :style="wrapperStyle"
    :role="effectivePhase === 'error' || effectivePhase === 'warning' ? 'alert' : 'status'"
    :aria-live="effectivePhase === 'error' || effectivePhase === 'warning' ? 'assertive' : 'polite'"
    aria-atomic="true"
    :data-center="isCenter || undefined"
    :data-theme="theme"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart="swipe.onTouchStart"
    @touchmove="swipe.onTouchMove"
    @touchend="swipe.onTouchEnd"
    @touchcancel="swipe.onTouchEnd"
  >
    <svg :class="styles.blobSvg" aria-hidden="true">
      <path
        ref="pathRef"
        :fill="fillColor"
        :stroke="toast.borderColor || 'none'"
        :stroke-width="toast.borderColor ? (toast.borderWidth ?? 1.5) : 0"
      />
    </svg>

    <button
      v-if="showCloseButton && effectivePhase !== 'loading'"
      :class="closeButtonClass"
      aria-label="Close toast"
      type="button"
      :style="closeButtonStyle"
      @click="handleCloseClick"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>

    <div
      ref="contentRef"
      :class="cx(styles.content, showBody ? styles.contentExpanded : styles.contentCompact, toast.classNames?.content)"
      :style="contentStyle"
    >
      <div
        ref="headerRef"
        :class="cx(styles.header, titleColorMap[effectivePhase], toast.classNames?.header)"
      >
        <div :class="cx(styles.iconWrapper, toast.classNames?.icon)">
          <Transition name="gooey-icon" mode="out-in">
            <div :key="iconTransitionKey">
              <VNodeRenderer v-if="!actionSuccess && toast.icon" :content="toast.icon" />
              <SpinnerIcon
                v-else-if="isLoading"
                :size="18"
                :class="styles.spinnerSpin"
              />
              <component :is="phaseIconComponent" v-else :size="18" />
            </div>
          </Transition>
        </div>

        <span :class="cx(styles.title, toast.classNames?.title)">{{ effectiveTitle }}</span>

        <span
          v-if="!hasDescription && !hasAction && !actionSuccess && toast.showTimestamp !== false"
          :class="styles.timestamp"
        >
          {{ timestampStr }}
        </span>
      </div>

      <Transition name="gooey-fade">
        <div
          v-if="showBody && hasDescription && !dismissing"
          :class="cx(styles.description, toast.classNames?.description)"
          style="text-align: left"
        >
          <div style="display: flex; align-items: flex-start; gap: 10px">
            <div style="flex: 1; min-width: 0">
              <VNodeRenderer :content="effectiveDescription!" />
            </div>
            <span v-if="toast.showTimestamp !== false" :class="styles.timestamp">{{ timestampStr }}</span>
          </div>
        </div>
      </Transition>

      <Transition name="gooey-fade">
        <div
          v-if="showBody && !hasDescription && hasAction && !dismissing && toast.showTimestamp !== false"
          :class="styles.timestamp"
          style="text-align: right; margin-top: 8px; padding-left: 0"
        >
          {{ timestampStr }}
        </div>
      </Transition>

      <Transition name="gooey-fade">
        <div
          v-if="showBody && hasAction && effectiveAction && !dismissing"
          :class="cx(styles.actionWrapper, toast.classNames?.actionWrapper)"
        >
          <button
            :class="cx(styles.actionButton, actionColorMap[effectivePhase], toast.classNames?.actionButton)"
            type="button"
            :aria-label="effectiveAction.label"
            @click="handleActionClick"
          >
            {{ effectiveAction.label }}
          </button>
        </div>
      </Transition>

      <div
        v-if="showProgress"
        :key="progressKey"
        :class="cx(styles.progressWrapper, (hovered || containerHovered) && styles.progressPaused)"
        :style="{ opacity: showBody && !actionSuccess ? 1 : 0 }"
      >
        <div
          :class="cx(styles.progressBar, progressColorMap[effectivePhase])"
          :style="progressBarStyle"
        />
      </div>
    </div>
  </div>
</template>

<style>
.gooey-icon-enter-from,
.gooey-icon-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.gooey-icon-enter-active,
.gooey-icon-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.gooey-fade-enter-from,
.gooey-fade-leave-to {
  opacity: 0;
}

.gooey-fade-enter-active,
.gooey-fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
