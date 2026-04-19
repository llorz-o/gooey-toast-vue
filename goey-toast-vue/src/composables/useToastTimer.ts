import { watch, onUnmounted, ref, readonly, type Ref } from 'vue'

const DEFAULT_DISPLAY_DURATION = 4000

export interface UseToastTimerOptions {
  duration: Ref<number | undefined>
  expandDelayMs: Ref<number>
  collapseMs: Ref<number>
  paused: Ref<boolean>
  enabled: Ref<boolean>
  onTimeout: () => void
}

export interface UseToastTimerReturn {
  progressDuration: Readonly<Ref<number>>
  restart: () => void
}

export function useToastTimer(options: UseToastTimerOptions): UseToastTimerReturn {
  const progressDuration = ref(0)
  let remaining: number | null = null
  let timerStart = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function startTimer() {
    clearTimer()

    const displayMs = options.duration.value ?? DEFAULT_DISPLAY_DURATION
    const fullDelay = displayMs - options.expandDelayMs.value - options.collapseMs.value
    progressDuration.value = Math.max(fullDelay, 0)
    if (fullDelay <= 0) return

    if (options.paused.value) return

    const delay = remaining ?? fullDelay
    timerStart = Date.now()

    timer = setTimeout(() => {
      if (options.paused.value) {
        const elapsed = Date.now() - timerStart
        remaining = Math.max(0, delay - elapsed)
        return
      }
      remaining = null
      options.onTimeout()
    }, delay)
  }

  function pauseTimer() {
    if (timer === null) return
    const elapsed = Date.now() - timerStart
    const delay = remaining ?? progressDuration.value
    remaining = Math.max(0, delay - elapsed)
    clearTimer()
  }

  function resumeTimer() {
    if (remaining === null || remaining <= 0) return
    startTimer()
  }

  function restart() {
    const displayMs = options.duration.value ?? DEFAULT_DISPLAY_DURATION
    const fullDelay = Math.max(displayMs - options.expandDelayMs.value - options.collapseMs.value, 0)
    remaining = fullDelay
    progressDuration.value = fullDelay
    if (options.enabled.value && !options.paused.value && fullDelay > 0) {
      startTimer()
    }
  }

  watch(
    [options.enabled, options.paused],
    ([enabled, paused], [prevEnabled, prevPaused]) => {
      if (!enabled) {
        clearTimer()
        return
      }

      if (enabled && !prevEnabled) {
        startTimer()
        return
      }

      if (paused && !prevPaused) {
        pauseTimer()
      } else if (!paused && prevPaused) {
        resumeTimer()
      }
    },
    { immediate: true },
  )

  onUnmounted(clearTimer)

  return {
    progressDuration: readonly(progressDuration),
    restart,
  }
}
