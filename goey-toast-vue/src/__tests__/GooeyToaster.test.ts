import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import GooeyToaster from '../components/GooeyToaster.vue'
import { _config } from '../context'
import { _resetQueue, gooeyToast, _toasts } from '../gooey-toast'

vi.mock('motion', () => ({
  animate: vi.fn(() => ({ stop: vi.fn() })),
}))

let wrapper: VueWrapper | null = null

beforeEach(() => {
  _resetQueue()
  _config.position = 'bottom-right'
  _config.closeOnEscape = true
  _config.visibleToasts = 3
  _config.theme = 'light'
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

describe('GooeyToaster props sync', () => {
  it('syncs position prop to _config', async () => {
    wrapper = mount(GooeyToaster, {
      props: { position: 'top-left' },
      attachTo: document.body,
    })
    await nextTick()
    expect(_config.position).toBe('top-left')
  })

  it('syncs theme prop to _config', async () => {
    wrapper = mount(GooeyToaster, {
      props: { theme: 'dark' },
      attachTo: document.body,
    })
    await nextTick()
    expect(_config.theme).toBe('dark')
  })

  it('syncs closeOnEscape prop to _config', async () => {
    wrapper = mount(GooeyToaster, {
      props: { closeOnEscape: false },
      attachTo: document.body,
    })
    await nextTick()
    expect(_config.closeOnEscape).toBe(false)
  })

  it('syncs visibleToasts prop to _config', async () => {
    wrapper = mount(GooeyToaster, {
      props: { visibleToasts: 5 },
      attachTo: document.body,
    })
    await nextTick()
    expect(_config.visibleToasts).toBe(5)
  })
})

describe('GooeyToaster Escape key dismiss', () => {
  it('dismisses most recent toast on Escape when closeOnEscape=true', async () => {
    wrapper = mount(GooeyToaster, {
      props: { closeOnEscape: true },
      attachTo: document.body,
    })
    await nextTick()

    gooeyToast('Toast 1')
    gooeyToast('Toast 2')
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(_toasts.value).toHaveLength(1)
    expect(_toasts.value[0].title).toBe('Toast 1')
  })

  it('does NOT dismiss on Escape when closeOnEscape=false', async () => {
    wrapper = mount(GooeyToaster, {
      props: { closeOnEscape: false },
      attachTo: document.body,
    })
    await nextTick()

    gooeyToast('Toast A')
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(_toasts.value).toHaveLength(1)
  })
})
