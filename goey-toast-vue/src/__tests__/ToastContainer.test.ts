import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ToastContainer from '../components/ToastContainer.vue'
import { _resetQueue, gooeyToast, _toasts } from '../gooey-toast'

vi.mock('motion', () => ({
  animate: vi.fn(() => ({ stop: vi.fn() })),
}))

beforeEach(() => {
  _resetQueue()
})

describe('ToastContainer', () => {
  it('renders an ol with data-gooey-toaster attribute', () => {
    const wrapper = mount(ToastContainer, {
      props: { position: 'bottom-right', gap: 14, offset: '24px', theme: 'light', dir: 'ltr', visibleToasts: 3 },
      attachTo: document.body,
    })
    const ol = document.querySelector('[data-gooey-toaster]')
    expect(ol).not.toBeNull()
    wrapper.unmount()
  })

  it('renders a list item for each active toast', async () => {
    gooeyToast('T1')
    gooeyToast('T2')
    await nextTick()

    const wrapper = mount(ToastContainer, {
      props: { position: 'bottom-right', gap: 14, offset: '24px', theme: 'light', dir: 'ltr', visibleToasts: 3 },
      attachTo: document.body,
    })
    await nextTick()

    const items = document.querySelectorAll('[data-gooey-toaster] li')
    expect(items.length).toBe(2)
    wrapper.unmount()
  })

  it('sets data-position attribute from position prop', () => {
    const wrapper = mount(ToastContainer, {
      props: { position: 'top-center', gap: 14, offset: '24px', theme: 'light', dir: 'ltr', visibleToasts: 3 },
      attachTo: document.body,
    })
    const ol = document.querySelector('[data-gooey-toaster]')
    expect(ol?.getAttribute('data-position')).toBe('top-center')
    wrapper.unmount()
  })

  it('sets data-theme attribute from theme prop', () => {
    const wrapper = mount(ToastContainer, {
      props: { position: 'bottom-right', gap: 14, offset: '24px', theme: 'dark', dir: 'ltr', visibleToasts: 3 },
      attachTo: document.body,
    })
    const ol = document.querySelector('[data-gooey-toaster]')
    expect(ol?.getAttribute('data-theme')).toBe('dark')
    wrapper.unmount()
  })

  it('removes toast from _toasts when GooeyToast emits dismiss', async () => {
    const id = gooeyToast('Dismiss me')
    await nextTick()

    mount(ToastContainer, {
      props: { position: 'bottom-right', gap: 14, offset: '24px', theme: 'light', dir: 'ltr', visibleToasts: 3 },
      attachTo: document.body,
    })
    await nextTick()

    expect(_toasts.value).toHaveLength(1)
    _toasts.value.splice(0, 1)
    await nextTick()
    expect(_toasts.value).toHaveLength(0)
  })
})
