import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AriaLiveAnnouncer from '../components/AriaLiveAnnouncer.vue'
import { _announcement, announce } from '../context'

beforeEach(() => {
  _announcement.value = null
})

describe('AriaLiveAnnouncer', () => {
  it('renders two visually-hidden regions', () => {
    const wrapper = mount(AriaLiveAnnouncer)
    const polite = wrapper.find('[role="status"]')
    const assertive = wrapper.find('[role="alert"]')
    expect(polite.exists()).toBe(true)
    expect(assertive.exists()).toBe(true)
  })

  it('polite region has aria-live="polite"', () => {
    const wrapper = mount(AriaLiveAnnouncer)
    expect(wrapper.find('[role="status"]').attributes('aria-live')).toBe('polite')
  })

  it('assertive region has aria-live="assertive"', () => {
    const wrapper = mount(AriaLiveAnnouncer)
    expect(wrapper.find('[role="alert"]').attributes('aria-live')).toBe('assertive')
  })

  it('shows polite message after announce("msg", "polite")', async () => {
    const wrapper = mount(AriaLiveAnnouncer)
    announce('Hello polite', 'polite')
    await new Promise<void>(resolve => queueMicrotask(resolve))
    await nextTick()
    await nextTick()
    expect(wrapper.find('[role="status"]').text()).toBe('Hello polite')
  })

  it('shows assertive message after announce("msg", "assertive")', async () => {
    const wrapper = mount(AriaLiveAnnouncer)
    announce('Critical error', 'assertive')
    await new Promise<void>(resolve => queueMicrotask(resolve))
    await nextTick()
    await nextTick()
    expect(wrapper.find('[role="alert"]').text()).toBe('Critical error')
  })

  it('polite message does not appear in assertive region', async () => {
    const wrapper = mount(AriaLiveAnnouncer)
    announce('Polite only', 'polite')
    await new Promise<void>(resolve => queueMicrotask(resolve))
    await nextTick()
    await nextTick()
    expect(wrapper.find('[role="alert"]').text()).toBe('')
  })

  it('assertive message does not appear in polite region', async () => {
    const wrapper = mount(AriaLiveAnnouncer)
    announce('Assertive only', 'assertive')
    await new Promise<void>(resolve => queueMicrotask(resolve))
    await nextTick()
    await nextTick()
    expect(wrapper.find('[role="status"]').text()).toBe('')
  })
})
