import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import LoginView from '@/views/auth/LoginView.vue'
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

const mockRouter = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
  ],
})

describe('Login View', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mountComponent = () => {
    return mount(LoginView, {
      global: {
        plugins: [mockRouter, i18n],
        stubs: {
          'router-link': true,
          'el-icon': { template: '<div class="el-icon-stub"><slot /></div>' },
          'el-input': { template: '<input class="el-input-stub" />' },
          'el-form': { template: '<form class="el-form-stub"><slot /></form>' },
          'el-form-item': { template: '<div class="el-form-item-stub"><slot /></div>' },
          'el-button': { template: '<button class="el-button-stub"><slot /></button>' },
        },
      },
    })
  }

  it('should render login form', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.find('.login-container').exists()).toBe(true)
    expect(wrapper.find('.left-panel').exists()).toBe(true)
    expect(wrapper.find('.right-panel').exists()).toBe(true)
  })

  it('should have initial form values', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.vm.loginForm.username).toBe('admin')
    expect(wrapper.vm.loginForm.password).toBe('')
    expect(wrapper.vm.loginForm.captcha).toBe('')
  })

  it('should generate captcha on mount', async () => {
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.mockCaptcha).toHaveLength(5)
    expect(/^\d{5}$/.test(wrapper.vm.mockCaptcha)).toBe(true)
  })

  it('should display captcha', () => {
    const wrapper = mountComponent()
    
    const captchaElement = wrapper.find('.captcha-image')
    expect(captchaElement.exists()).toBe(true)
  })

  it('should show logo and title', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.find('.logo-text').text()).toBe('AIDP')
  })

  it('should have right panel with title', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.find('.right-title').text()).toBe('[GIN] Hello World!')
  })

  it('should have login and initialization buttons', () => {
    const wrapper = mountComponent()
    
    const buttons = wrapper.findAll('.el-button-stub')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })
})