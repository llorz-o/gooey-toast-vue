import { ref, type VNode } from 'vue'
import { _config, announce, type AriaLivePoliteness } from './context'
import type {
  GooeyToastOptions,
  GooeyPromiseData,
  GooeyToastPhase,
  GooeyToastType,
  GooeyToastAction,
  GooeyToastClassNames,
  GooeyToastTimings,
  GooeyToastUpdateOptions,
  DismissFilter,
} from './types'
import type { AnimationPresetName } from './presets'

function getAnnouncePoliteness(type: GooeyToastType): AriaLivePoliteness {
  return type === 'error' || type === 'warning' ? 'assertive' : 'polite'
}

function buildAnnouncementMessage(title: string, description?: VNode | string): string {
  if (!description || typeof description !== 'string') return title
  return `${title}: ${description}`
}

export interface InternalToast {
  id: string | number
  title: string
  type: GooeyToastType
  phase: GooeyToastPhase
  _dismissRequested?: boolean
  description?: VNode | string
  action?: GooeyToastAction
  icon?: VNode | string
  duration?: number
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
  _onDismiss?: (id: string | number) => void
  _onAutoClose?: (id: string | number) => void
}

export const _toasts = ref<InternalToast[]>([])

const _queue: Array<{ id: string | number; type: GooeyToastType; toast: InternalToast }> = []
const _autoCloseFlags = new Set<string | number>()
const _manualDismissFlags = new Set<string | number>()

function getActiveToastCount() {
  return _toasts.value.filter(t => !t._dismissRequested).length
}

export function _markAutoClose(id: string | number) {
  _autoCloseFlags.add(id)
}

export function _resetQueue() {
  _toasts.value = []
  _queue.length = 0
  _autoCloseFlags.clear()
  _manualDismissFlags.clear()
}

export function _getMostRecentActiveId(): string | number | undefined {
  const toasts = _toasts.value
  return toasts.length > 0 ? toasts[toasts.length - 1].id : undefined
}

function _processQueue() {
  const max = _config.visibleToasts
  while (_queue.length > 0 && getActiveToastCount() < max) {
    const next = _queue.shift()!
    _toasts.value.push(next.toast)
  }
}

function _enqueue(entry: { id: string | number; type: GooeyToastType; toast: InternalToast }): boolean {
  const maxQueue = _config.maxQueue
  const overflow = _config.queueOverflow
  if (_queue.length >= maxQueue) {
    if (overflow === 'drop-newest') return false
    _queue.shift()
  }
  _queue.push(entry)
  return true
}

export function _onToastDismissed(id: string | number) {
  const idx = _toasts.value.findIndex(t => t.id === id)
  if (idx === -1) return

  const toast = _toasts.value[idx]
  _toasts.value.splice(idx, 1)

  const isAutoClose = _autoCloseFlags.has(id) || !_manualDismissFlags.has(id)
  if (isAutoClose && toast._onAutoClose) {
    try { toast._onAutoClose(id) } catch { /* callback errors must not break queue */ }
  }
  if (toast._onDismiss) {
    try { toast._onDismiss(id) } catch { /* callback errors must not break queue */ }
  }

  _autoCloseFlags.delete(id)
  _manualDismissFlags.delete(id)
  _processQueue()
}

export function _requestToastDismiss(id: string | number, auto = false) {
  const toast = _toasts.value.find(t => t.id === id)
  if (!toast) return false
  if (toast._dismissRequested) return true

  if (auto) _autoCloseFlags.add(id)
  else _manualDismissFlags.add(id)

  toast._dismissRequested = true
  _processQueue()
  return true
}

function updateGooeyToast(id: string | number, options: GooeyToastUpdateOptions) {
  const toast = _toasts.value.find(t => t.id === id)
  if (!toast) return

  if (options.title !== undefined) toast.title = options.title
  if (options.description !== undefined) toast.description = options.description
  if (options.type !== undefined) {
    toast.type = options.type
    toast.phase = options.type
  }
  if (options.action !== undefined) toast.action = options.action
  if ('icon' in options) toast.icon = options.icon ?? undefined
  if (options.showTimestamp !== undefined) toast.showTimestamp = options.showTimestamp

  if (options.title !== undefined) {
    announce(
      buildAnnouncementMessage(options.title, options.description),
      options.type ? getAnnouncePoliteness(options.type) : 'polite',
    )
  }
}

function createGooeyToast(
  title: string,
  type: GooeyToastType,
  options?: GooeyToastOptions,
) {
  const toastId = options?.id ?? Math.random().toString(36).slice(2)

  const toast: InternalToast = {
    id: toastId,
    title,
    type,
    phase: type,
    description: options?.description,
    action: options?.action,
    icon: options?.icon,
    duration: options?.timing?.displayDuration ?? options?.duration,
    classNames: options?.classNames,
    fillColor: options?.fillColor,
    borderColor: options?.borderColor,
    borderWidth: options?.borderWidth,
    timing: options?.timing,
    preset: options?.preset,
    spring: options?.spring,
    bounce: options?.bounce,
    showProgress: options?.showProgress,
    showTimestamp: options?.showTimestamp,
    _onDismiss: options?.onDismiss,
    _onAutoClose: options?.onAutoClose,
  }

  announce(
    buildAnnouncementMessage(title, options?.description),
    getAnnouncePoliteness(type),
  )

  if (getActiveToastCount() < _config.visibleToasts) {
    _toasts.value.push(toast)
  } else {
    _enqueue({ id: toastId, type, toast })
  }

  return toastId
}

function dismissGooeyToast(idOrFilter?: string | number | DismissFilter) {
  if (idOrFilter != null && typeof idOrFilter === 'object') {
    const filterTypes = Array.isArray(idOrFilter.type) ? idOrFilter.type : [idOrFilter.type]
    const typesSet = new Set<GooeyToastType>(filterTypes)

    for (let i = _queue.length - 1; i >= 0; i--) {
      if (typesSet.has(_queue[i].type)) {
        _queue.splice(i, 1)
      }
    }

    const toRemove = _toasts.value.filter(t => typesSet.has(t.type))
    for (const t of toRemove) {
      _requestToastDismiss(t.id)
    }
  } else if (idOrFilter != null) {
    const qIdx = _queue.findIndex(q => q.id === idOrFilter)
    if (qIdx !== -1) {
      _queue.splice(qIdx, 1)
      return
    }
    _requestToastDismiss(idOrFilter)
  } else {
    for (const t of _toasts.value) {
      _requestToastDismiss(t.id)
    }
    _queue.length = 0
  }
}

export const gooeyToast = Object.assign(
  (title: string, options?: GooeyToastOptions) =>
    createGooeyToast(title, 'default', options),
  {
    success: (title: string, options?: GooeyToastOptions) =>
      createGooeyToast(title, 'success', options),
    error: (title: string, options?: GooeyToastOptions) =>
      createGooeyToast(title, 'error', options),
    warning: (title: string, options?: GooeyToastOptions) =>
      createGooeyToast(title, 'warning', options),
    info: (title: string, options?: GooeyToastOptions) =>
      createGooeyToast(title, 'info', options),
    promise: <T,>(promise: Promise<T>, data: GooeyPromiseData<T>) => {
      const id = Math.random().toString(36).slice(2)

      announce(buildAnnouncementMessage(data.loading, data.description?.loading), 'polite')

      const toast: InternalToast = {
        id,
        title: data.loading,
        type: 'info',
        phase: 'loading',
        description: data.description?.loading,
        classNames: data.classNames,
        fillColor: data.fillColor,
        borderColor: data.borderColor,
        borderWidth: data.borderWidth,
        timing: data.timing,
        preset: data.preset,
        spring: data.spring,
        bounce: data.bounce,
        showTimestamp: data.showTimestamp,
        _onDismiss: data.onDismiss,
        _onAutoClose: data.onAutoClose,
      }

      if (getActiveToastCount() < _config.visibleToasts) {
        _toasts.value.push(toast)
      } else {
        _enqueue({ id, type: 'info', toast })
      }

      promise
        .then((result) => {
          const existing = _toasts.value.find(t => t.id === id)
          if (!existing) return
          const desc = typeof data.description?.success === 'function'
            ? data.description.success(result)
            : data.description?.success
          const resolvedTitle = typeof data.success === 'function'
            ? data.success(result)
            : data.success
          existing.title = resolvedTitle
          existing.description = desc
          existing.action = data.action?.success
          existing.phase = 'success'
          existing.type = 'success'
          announce(buildAnnouncementMessage(resolvedTitle, desc), 'polite')
        })
        .catch((err) => {
          const existing = _toasts.value.find(t => t.id === id)
          if (!existing) return
          const desc = typeof data.description?.error === 'function'
            ? data.description.error(err)
            : data.description?.error
          const resolvedTitle = typeof data.error === 'function' ? data.error(err) : data.error
          existing.title = resolvedTitle
          existing.description = desc
          existing.action = data.action?.error
          existing.phase = 'error'
          existing.type = 'error'
          announce(buildAnnouncementMessage(resolvedTitle, desc), 'assertive')
        })

      return id
    },
    dismiss: dismissGooeyToast,
    update: updateGooeyToast,
  },
)
