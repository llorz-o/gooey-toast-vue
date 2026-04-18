import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import ToastErrorBoundary from '../components/ToastErrorBoundary.vue'

describe('ToastErrorBoundary', () => {
  it('renders slot content when no error', () => {
    const wrapper = mount(ToastErrorBoundary, {
      slots: {
        default: '<div data-testid="child">OK</div>',
      },
    })
    expect(wrapper.find('[data-testid="child"]').exists()).toBe(true)
    expect(wrapper.text()).toBe('OK')
  })

  it('hides slot content when child throws', async () => {
    const ThrowingChild = defineComponent({
      setup() {
        throw new Error('render error')
      },
      render() {
        return h('div', 'should not render')
      },
    })

    const wrapper = mount(ToastErrorBoundary, {
      slots: {
        default: ThrowingChild,
      },
      global: {
        config: {
          warnHandler: () => {},
        },
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('')
  })

  it('renders nothing (not the slot) after error', async () => {
    const ThrowingChild = defineComponent({
      setup() {
        throw new Error('boom')
      },
      render() {
        return h('span', 'visible')
      },
    })

    const wrapper = mount(ToastErrorBoundary, {
      slots: { default: ThrowingChild },
      global: { config: { warnHandler: () => {} } },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('span').exists()).toBe(false)
  })
})
