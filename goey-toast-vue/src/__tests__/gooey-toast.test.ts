import { nextTick } from 'vue'
import {
  _toasts,
  _resetQueue,
  _markAutoClose,
  _onToastDismissed,
  _requestToastDismiss,
  _getMostRecentActiveId,
  gooeyToast,
} from '../gooey-toast'
import { _config, _announcement } from '../context'

beforeEach(() => {
  _resetQueue()
})

describe('gooeyToast() basic creation', () => {
  it('returns a string id', () => {
    const id = gooeyToast('Hello')
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('adds toast to _toasts', () => {
    gooeyToast('Hello')
    expect(_toasts.value).toHaveLength(1)
    expect(_toasts.value[0].title).toBe('Hello')
  })

  it('respects custom id option', () => {
    const id = gooeyToast('Hello', { id: 'my-id' })
    expect(id).toBe('my-id')
    expect(_toasts.value[0].id).toBe('my-id')
  })

  it('sets type and phase to "default"', () => {
    gooeyToast('Hello')
    expect(_toasts.value[0].type).toBe('default')
    expect(_toasts.value[0].phase).toBe('default')
  })
})

describe('type-specific methods', () => {
  it('success sets type and phase to "success"', () => {
    gooeyToast.success('Done')
    expect(_toasts.value[0].type).toBe('success')
    expect(_toasts.value[0].phase).toBe('success')
  })

  it('error sets type and phase to "error"', () => {
    gooeyToast.error('Oops')
    expect(_toasts.value[0].type).toBe('error')
    expect(_toasts.value[0].phase).toBe('error')
  })

  it('warning sets type and phase to "warning"', () => {
    gooeyToast.warning('Watch out')
    expect(_toasts.value[0].type).toBe('warning')
    expect(_toasts.value[0].phase).toBe('warning')
  })

  it('info sets type and phase to "info"', () => {
    gooeyToast.info('FYI')
    expect(_toasts.value[0].type).toBe('info')
    expect(_toasts.value[0].phase).toBe('info')
  })
})

describe('visibleToasts queue behavior', () => {
  beforeEach(() => {
    _config.visibleToasts = 3
  })

  afterEach(() => {
    _config.visibleToasts = 3
  })

  it('4th toast goes to queue, not _toasts', () => {
    gooeyToast('T1')
    gooeyToast('T2')
    gooeyToast('T3')
    gooeyToast('T4')
    expect(_toasts.value).toHaveLength(3)
    expect(_toasts.value.map(t => t.title)).not.toContain('T4')
  })

  it('dismissing an active toast promotes queued toast', () => {
    const id1 = gooeyToast('T1')
    gooeyToast('T2')
    gooeyToast('T3')
    gooeyToast('T4')
    _onToastDismissed(id1)
    expect(_toasts.value).toHaveLength(3)
    expect(_toasts.value.map(t => t.title)).toContain('T4')
  })

  it('dismiss request frees a visible slot before final removal', () => {
    _config.visibleToasts = 1
    const id1 = gooeyToast('T1')
    gooeyToast('T2')

    expect(_toasts.value.map(t => t.title)).toEqual(['T1'])

    expect(_requestToastDismiss(id1)).toBe(true)

    expect(_toasts.value).toHaveLength(2)
    expect(_toasts.value.find(t => t.id === id1)?._dismissRequested).toBe(true)
    expect(_toasts.value.find(t => t.title === 'T2')).toBeTruthy()
  })
})

describe('queue overflow strategies', () => {
  beforeEach(() => {
    _config.visibleToasts = 1
    _config.maxQueue = 1
  })

  afterEach(() => {
    _config.visibleToasts = 3
    _config.maxQueue = Infinity
    _config.queueOverflow = 'drop-oldest'
  })

  it('drop-newest: second queued toast is dropped', () => {
    _config.queueOverflow = 'drop-newest'
    gooeyToast('Active')
    gooeyToast('Q1')
    gooeyToast('Q2')
    const activeId = _toasts.value[0].id
    _onToastDismissed(activeId)
    expect(_toasts.value).toHaveLength(1)
    expect(_toasts.value[0].title).toBe('Q1')
  })

  it('drop-oldest: first queued toast is replaced', () => {
    _config.queueOverflow = 'drop-oldest'
    gooeyToast('Active')
    gooeyToast('Q1')
    gooeyToast('Q2')
    const activeId = _toasts.value[0].id
    _onToastDismissed(activeId)
    expect(_toasts.value).toHaveLength(1)
    expect(_toasts.value[0].title).toBe('Q2')
  })
})

describe('gooeyToast.dismiss()', () => {
  it('dismiss(id) marks specific toast for animated removal', () => {
    const id = gooeyToast('Hello')
    gooeyToast('World')
    gooeyToast.dismiss(id)
    expect(_toasts.value).toHaveLength(2)
    expect(_toasts.value.find(t => t.id === id)?._dismissRequested).toBe(true)
  })

  it('dismiss() with no args marks all active toasts for animated removal', () => {
    gooeyToast('T1')
    gooeyToast('T2')
    gooeyToast('T3')
    gooeyToast.dismiss()
    expect(_toasts.value).toHaveLength(3)
    expect(_toasts.value.every(t => t._dismissRequested)).toBe(true)
  })

  it('dismiss({ type }) marks only matching type', () => {
    gooeyToast.success('S1')
    gooeyToast.error('E1')
    gooeyToast.success('S2')
    gooeyToast.dismiss({ type: 'error' })
    expect(_toasts.value).toHaveLength(3)
    expect(_toasts.value.find(t => t.type === 'error')?._dismissRequested).toBe(true)
    expect(_toasts.value.filter(t => t.type === 'success').every(t => !t._dismissRequested)).toBe(true)
  })

  it('dismiss({ type: [...] }) marks multiple types', () => {
    gooeyToast.success('S1')
    gooeyToast.error('E1')
    gooeyToast.warning('W1')
    gooeyToast.info('I1')
    gooeyToast.dismiss({ type: ['error', 'warning'] })
    expect(_toasts.value).toHaveLength(4)
    expect(_toasts.value.filter(t => t.type === 'error' || t.type === 'warning').every(t => t._dismissRequested)).toBe(true)
    expect(_toasts.value.filter(t => t.type === 'success' || t.type === 'info').every(t => !t._dismissRequested)).toBe(true)
  })
})

describe('_requestToastDismiss()', () => {
  it('marks toast for manual dismiss without removing it', () => {
    const id = gooeyToast('Hello')
    expect(_requestToastDismiss(id)).toBe(true)
    expect(_toasts.value).toHaveLength(1)
    expect(_toasts.value[0]._dismissRequested).toBe(true)
  })
})

describe('dismiss callbacks', () => {
  it('_onDismiss is called on manual dismiss', () => {
    const onDismiss = vi.fn()
    const id = gooeyToast('Hello', { onDismiss })
    gooeyToast.dismiss(id)
    _onToastDismissed(id)
    expect(onDismiss).toHaveBeenCalledWith(id)
  })

  it('_onAutoClose is called when _markAutoClose is set before _onToastDismissed', () => {
    const onAutoClose = vi.fn()
    const id = gooeyToast('Hello', { onAutoClose })
    _markAutoClose(id)
    _onToastDismissed(id)
    expect(onAutoClose).toHaveBeenCalledWith(id)
  })

  it('_onAutoClose is NOT called on manual dismiss', () => {
    const onAutoClose = vi.fn()
    const id = gooeyToast('Hello', { onAutoClose })
    gooeyToast.dismiss(id)
    _onToastDismissed(id)
    expect(onAutoClose).not.toHaveBeenCalled()
  })

  it('_onDismiss is called even on auto-close', () => {
    const onDismiss = vi.fn()
    const id = gooeyToast('Hello', { onDismiss })
    _markAutoClose(id)
    _onToastDismissed(id)
    expect(onDismiss).toHaveBeenCalledWith(id)
  })
})

describe('gooeyToast.update()', () => {
  it('updates title of existing toast', () => {
    const id = gooeyToast('Original')
    gooeyToast.update(id, { title: 'Updated' })
    expect(_toasts.value[0].title).toBe('Updated')
  })

  it('updates type and phase', () => {
    const id = gooeyToast('Loading')
    gooeyToast.update(id, { title: 'Done', type: 'success' })
    expect(_toasts.value[0].type).toBe('success')
    expect(_toasts.value[0].phase).toBe('success')
  })

  it('does not throw for non-existent id', () => {
    expect(() => gooeyToast.update('nonexistent', { title: 'X' })).not.toThrow()
  })
})

describe('gooeyToast.promise()', () => {
  it('creates toast with phase="loading" and type="info"', () => {
    const p = new Promise<string>(() => {})
    gooeyToast.promise(p, { loading: 'Loading...', success: 'Done', error: 'Failed' })
    expect(_toasts.value).toHaveLength(1)
    expect(_toasts.value[0].phase).toBe('loading')
    expect(_toasts.value[0].type).toBe('info')
    expect(_toasts.value[0].title).toBe('Loading...')
  })

  it('updates to success on resolve', async () => {
    const p = Promise.resolve('result')
    gooeyToast.promise(p, { loading: 'Loading...', success: 'Done', error: 'Failed' })
    await p.catch(() => {})
    await nextTick()
    expect(_toasts.value[0].phase).toBe('success')
    expect(_toasts.value[0].type).toBe('success')
    expect(_toasts.value[0].title).toBe('Done')
  })

  it('updates to error on reject', async () => {
    const p = Promise.reject(new Error('oops'))
    gooeyToast.promise(p, { loading: 'Loading...', success: 'Done', error: 'Failed' })
    await p.catch(() => {})
    await nextTick()
    expect(_toasts.value[0].phase).toBe('error')
    expect(_toasts.value[0].type).toBe('error')
    expect(_toasts.value[0].title).toBe('Failed')
  })

  it('calls success function with result', async () => {
    const p = Promise.resolve(42)
    gooeyToast.promise(p, {
      loading: 'Loading...',
      success: (n) => `Got ${n}`,
      error: 'Failed',
    })
    await p
    await nextTick()
    expect(_toasts.value[0].title).toBe('Got 42')
  })

  it('calls error function with error', async () => {
    const err = new Error('boom')
    const p = Promise.reject(err)
    gooeyToast.promise(p, {
      loading: 'Loading...',
      success: 'Done',
      error: (e: unknown) => `Error: ${(e as Error).message}`,
    })
    await p.catch(() => {})
    await nextTick()
    expect(_toasts.value[0].title).toBe('Error: boom')
  })

  it('returns a string id', () => {
    const p = new Promise<void>(() => {})
    const id = gooeyToast.promise(p, { loading: 'L', success: 'S', error: 'E' })
    expect(typeof id).toBe('string')
  })
})

describe('_getMostRecentActiveId()', () => {
  it('returns undefined when no toasts', () => {
    expect(_getMostRecentActiveId()).toBeUndefined()
  })

  it('returns id of last toast', () => {
    gooeyToast('T1')
    const id2 = gooeyToast('T2')
    expect(_getMostRecentActiveId()).toBe(id2)
  })
})

describe('announce on toast creation', () => {
  it('sets _announcement after queueMicrotask', async () => {
    gooeyToast('Hello world')
    await new Promise<void>(resolve => queueMicrotask(resolve))
    expect(_announcement.value).not.toBeNull()
    expect(_announcement.value?.message).toBe('Hello world')
    expect(_announcement.value?.politeness).toBe('polite')
  })

  it('uses assertive politeness for error toasts', async () => {
    gooeyToast.error('Something broke')
    await new Promise<void>(resolve => queueMicrotask(resolve))
    expect(_announcement.value?.politeness).toBe('assertive')
  })

  it('uses assertive politeness for warning toasts', async () => {
    gooeyToast.warning('Watch out')
    await new Promise<void>(resolve => queueMicrotask(resolve))
    expect(_announcement.value?.politeness).toBe('assertive')
  })
})
