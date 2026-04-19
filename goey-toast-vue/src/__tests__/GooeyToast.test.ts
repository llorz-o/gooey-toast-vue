import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import GooeyToast from '../components/GooeyToast.vue'
import type { InternalToast } from '../gooey-toast'
import { _resetQueue } from '../gooey-toast'
import { _config } from '../context'

vi.mock('motion', () => ({
  animate: vi.fn(() => ({ stop: vi.fn() })),
}))

function makeToast(overrides: Partial<InternalToast> = {}): InternalToast {
  return {
    id: 'test-id',
    title: 'Test Toast',
    type: 'default',
    phase: 'default',
    ...overrides,
  }
}

beforeEach(() => {
  _resetQueue()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('GooeyToast rendering', () => {
  it('renders the toast title', () => {
    const wrapper = mount(GooeyToast, {
      props: { toast: makeToast({ title: 'Hello World' }), toastId: 'test-id' },
      attachTo: document.body,
    })
    expect(wrapper.text()).toContain('Hello World')
    wrapper.unmount()
  })

  it('has role="status" for default type', () => {
    const wrapper = mount(GooeyToast, {
      props: { toast: makeToast({ type: 'default', phase: 'default' }), toastId: 'test-id' },
      attachTo: document.body,
    })
    const root = wrapper.find('[role]')
    expect(root.attributes('role')).toBe('status')
    wrapper.unmount()
  })

  it('has role="alert" for error type', () => {
    const wrapper = mount(GooeyToast, {
      props: { toast: makeToast({ type: 'error', phase: 'error' }), toastId: 'test-id' },
      attachTo: document.body,
    })
    const root = wrapper.find('[role]')
    expect(root.attributes('role')).toBe('alert')
    wrapper.unmount()
  })

  it('has role="alert" for warning type', () => {
    const wrapper = mount(GooeyToast, {
      props: { toast: makeToast({ type: 'warning', phase: 'warning' }), toastId: 'test-id' },
      attachTo: document.body,
    })
    const root = wrapper.find('[role]')
    expect(root.attributes('role')).toBe('alert')
    wrapper.unmount()
  })

  it('has aria-live="assertive" for error', () => {
    const wrapper = mount(GooeyToast, {
      props: { toast: makeToast({ type: 'error', phase: 'error' }), toastId: 'test-id' },
      attachTo: document.body,
    })
    const root = wrapper.find('[aria-live]')
    expect(root.attributes('aria-live')).toBe('assertive')
    wrapper.unmount()
  })

  it('shows close button when closeButton config is not false', async () => {
    _config.closeButton = true
    const wrapper = mount(GooeyToast, {
      props: { toast: makeToast({ type: 'success', phase: 'success' }), toastId: 'test-id' },
      attachTo: document.body,
    })
    await nextTick()
    const closeBtn = wrapper.find('button[aria-label="Close toast"]')
    expect(closeBtn.exists()).toBe(true)
    _config.closeButton = false
    wrapper.unmount()
  })

  it('does NOT show close button during loading phase', async () => {
    const wrapper = mount(GooeyToast, {
      props: { toast: makeToast({ type: 'info', phase: 'loading' }), toastId: 'test-id' },
      attachTo: document.body,
    })
    await nextTick()
    const closeBtn = wrapper.find('button[aria-label="Close toast"]')
    expect(closeBtn.exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('GooeyToast events', () => {
  it('starts animated dismiss instead of emitting immediately when close button is clicked', async () => {
    _config.closeButton = true
    const wrapper = mount(GooeyToast, {
      props: { toast: makeToast({ type: 'success', phase: 'success' }), toastId: 'my-toast' },
      attachTo: document.body,
    })
    await nextTick()
    const closeBtn = wrapper.find('button[aria-label="Close toast"]')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('dismiss')).toBeFalsy()
    _config.closeButton = false
    wrapper.unmount()
  })
})
