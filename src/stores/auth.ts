import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, AuthState, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const storedToken = localStorage.getItem('token')
  const state = ref<AuthState>({
    user: storedToken ? {
      id: 1,
      username: 'admin',
      email: 'admin@aidp.com',
      roles: ['admin', 'user'],
    } : null,
    token: storedToken,
    isAuthenticated: !!storedToken,
  })

  const user = computed(() => state.value.user)
  const token = computed(() => state.value.token)
  const isAuthenticated = computed(() => state.value.isAuthenticated)
  const roles = computed(() => state.value.user?.roles || [])

  async function login(credentials: LoginCredentials): Promise<void> {
    try {
      const response = await mockLoginApi(credentials)
      state.value = {
        user: response.user,
        token: response.token,
        isAuthenticated: true,
      }
      localStorage.setItem('token', response.token)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  function logout(): void {
    state.value = {
      user: null,
      token: null,
      isAuthenticated: false,
    }
    localStorage.removeItem('token')
  }

  function hasRole(role: string): boolean {
    return roles.value.includes(role)
  }

  function hasAnyRole(rolesToCheck: string[]): boolean {
    return rolesToCheck.some((role) => roles.value.includes(role))
  }

  function hasAllRoles(rolesToCheck: string[]): boolean {
    return rolesToCheck.every((role) => roles.value.includes(role))
  }

  return {
    state,
    user,
    token,
    isAuthenticated,
    roles,
    login,
    logout,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  }
})

async function mockLoginApi(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  if (credentials.username === 'admin' && credentials.password === 'admin123') {
    return {
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@aidp.com',
        roles: ['admin', 'user'],
      },
      token: 'mock-token-' + Date.now(),
    }
  }
  
  throw new Error('Invalid credentials')
}