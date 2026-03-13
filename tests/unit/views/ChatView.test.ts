import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import ChatView from '@/views/chat/ChatView.vue'
import zhCN from '@/i18n/locales/zh-CN'
import en from '@/i18n/locales/en'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en',
  messages: {
    'zh-CN': zhCN,
    en: en,
  },
})

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    },
  }
})

vi.mock('@/components/ElIcon.vue', () => ({
  default: {
    name: 'ElIcon',
    template: '<div class="el-icon-stub"><slot /></div>',
    props: ['icon'],
  },
}))

const mockRouter = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'Chat', component: ChatView },
    { path: '/login', name: 'Login', component: { template: '<div>Login</div>' } },
  ],
})

describe('Chat View', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mountComponent = () => {
    return mount(ChatView, {
      global: {
        plugins: [mockRouter, i18n],
        stubs: {
          'el-icon': {
            name: 'ElIcon',
            template: '<div class="el-icon-stub"><slot /></div>',
            props: ['icon']
          },
          'User': { template: '<div class="user-icon-stub" />' },
          'el-tooltip': {
            name: 'ElTooltip',
            template: '<div class="el-tooltip-stub"><slot /></div>',
          },
          'el-button': { template: '<button class="el-button-stub"><slot /></button>' },
          'el-input': { template: '<input class="el-input-stub" />' },
          'el-dropdown': { template: '<div class="el-dropdown-stub"><slot /></div>' },
          'el-dropdown-menu': { template: '<div class="el-dropdown-menu-stub"><slot /></div>' },
          'el-dropdown-item': { template: '<div class="el-dropdown-item-stub"><slot /></div>' },
        },
      },
    })
  }

  it('should render chat layout', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.find('.chat-layout').exists()).toBe(true)
    expect(wrapper.find('.sidebar').exists()).toBe(true)
    expect(wrapper.find('.main-content').exists()).toBe(true)
  })

  it('should render sidebar with navigation', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.find('.quick-nav').exists()).toBe(true)
  })

  it('should render messages container', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.find('.messages-container').exists()).toBe(true)
  })

  it('should render input container', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.find('.input-container').exists()).toBe(true)
    expect(wrapper.find('.input-wrapper').exists()).toBe(true)
  })

  it('should display empty state when no messages', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-icon').exists()).toBe(true)
  })

  it('should have input message ref', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.vm.inputMessage).toBeDefined()
  })
})