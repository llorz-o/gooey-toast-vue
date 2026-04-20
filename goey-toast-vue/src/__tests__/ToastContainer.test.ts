import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ToastContainer from '../components/ToastContainer.vue'
import { _resetQueue, gooeyToast, _toasts } from '../gooey-toast'
import { containerHovered } from '../context'

vi.mock('motion', () => ({
  animate: vi.fn(() => ({ stop: vi.fn() })),
}))

beforeEach(() => {
  _resetQueue()
  containerHovered.value = false
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
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

  it('pushes the older toast down further when a newer toast has expanded height', async () => {
    const firstId = gooeyToast('T1')
    const secondId = gooeyToast('T2')
    await nextTick()

    const wrapper = mount(ToastContainer, {
      props: { position: 'bottom-right', gap: 14, offset: '24px', theme: 'light', dir: 'ltr', visibleToasts: 3 },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    vi.runAllTimers()
    await nextTick()

    const vm = wrapper.vm as unknown as {
      handleHeightChange: (id: string | number, height: number) => void
      getItemStyle: (index: number) => Record<string, string>
    }

    vm.handleHeightChange(firstId, 34)
    vm.handleHeightChange(secondId, 92)
    await nextTick()

    expect(vm.getItemStyle(0).transform).toContain('translate3d(0, -12px, 0) scale(0.98)')

    vi.runAllTimers()
    await nextTick()

    const firstStyle = vm.getItemStyle(0)
    const secondStyle = vm.getItemStyle(1)

    expect(firstStyle.transform).toContain('translate3d(0, -30px, 0) scale(1)')
    expect(secondStyle.transform).toContain('translate3d(0, 0px, 0) scale(1)')

    wrapper.unmount()
  })

  it('keeps previous transform for one frame before animating to new stack position', async () => {
    const firstId = gooeyToast('T1')
    const secondId = gooeyToast('T2')
    await nextTick()

    const wrapper = mount(ToastContainer, {
      props: { position: 'bottom-right', gap: 14, offset: '24px', theme: 'light', dir: 'ltr', visibleToasts: 3 },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    vi.runAllTimers()
    await nextTick()

    const vm = wrapper.vm as unknown as {
      handleHeightChange: (id: string | number, height: number) => void
      getItemStyle: (index: number) => Record<string, string>
    }

    vm.handleHeightChange(firstId, 34)
    vm.handleHeightChange(secondId, 34)
    await nextTick()
    vi.runAllTimers()
    await nextTick()

    expect(vm.getItemStyle(0).transform).toContain('translate3d(0, -12px, 0) scale(0.98)')

    vm.handleHeightChange(secondId, 92)
    await nextTick()

    expect(vm.getItemStyle(0).transform).toContain('translate3d(0, -12px, 0) scale(0.98)')

    vi.runAllTimers()
    await nextTick()

    expect(vm.getItemStyle(0).transform).toContain('translate3d(0, -30px, 0) scale(1)')

    wrapper.unmount()
  })

  it('bottom positions slide a new toast up from below before settling', async () => {
    gooeyToast('T1')
    await nextTick()

    const wrapper = mount(ToastContainer, {
      props: { position: 'bottom-right', gap: 14, offset: '24px', theme: 'light', dir: 'ltr', visibleToasts: 3 },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    vi.runAllTimers()
    await nextTick()

    const vm = wrapper.vm as unknown as {
      getItemStyle: (index: number) => Record<string, string>
    }

    gooeyToast('T2')
    await nextTick()
    await nextTick()

    expect(vm.getItemStyle(1).transform).toContain('translate3d(0, 34px, 0) scale(1)')

    vi.runAllTimers()
    await nextTick()

    expect(vm.getItemStyle(1).transform).toContain('translate3d(0, 0px, 0) scale(1)')

    wrapper.unmount()
  })

  it('top positions slide a new toast down from above before settling', async () => {
    gooeyToast('T1')
    await nextTick()

    const wrapper = mount(ToastContainer, {
      props: { position: 'top-center', gap: 14, offset: '24px', theme: 'light', dir: 'ltr', visibleToasts: 3 },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    vi.runAllTimers()
    await nextTick()

    const vm = wrapper.vm as unknown as {
      getItemStyle: (index: number) => Record<string, string>
    }

    gooeyToast('T2')
    await nextTick()
    await nextTick()

    expect(vm.getItemStyle(1).transform).toContain('translate3d(0, -34px, 0) scale(1)')

    vi.runAllTimers()
    await nextTick()

    expect(vm.getItemStyle(1).transform).toContain('translate3d(0, 0px, 0) scale(1)')

    wrapper.unmount()
  })
})
