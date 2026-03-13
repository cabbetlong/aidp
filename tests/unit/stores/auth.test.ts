import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initial state should be correct', () => {
    const authStore = useAuthStore()
    expect(authStore.state.user).toBeNull()
    expect(authStore.state.token).toBeNull()
    expect(authStore.state.isAuthenticated).toBe(false)
  })

  it('should login successfully with valid credentials', async () => {
    const authStore = useAuthStore()
    const credentials: LoginCredentials = {
      username: 'admin',
      password: 'admin123',
    }

    await authStore.login(credentials)

    expect(authStore.state.isAuthenticated).toBe(true)
    expect(authStore.state.user).not.toBeNull()
    expect(authStore.state.user?.username).toBe('admin')
    expect(authStore.state.token).toBeTruthy()
    expect(localStorage.getItem('token')).toBe(authStore.state.token)
  })

  it('should fail login with invalid credentials', async () => {
    const authStore = useAuthStore()
    const credentials: LoginCredentials = {
      username: 'invalid',
      password: 'wrong',
    }

    await expect(authStore.login(credentials)).rejects.toThrow('Invalid credentials')
    expect(authStore.state.isAuthenticated).toBe(false)
    expect(authStore.state.user).toBeNull()
  })

  it('should logout successfully', () => {
    const authStore = useAuthStore()
    
    authStore.state.user = { id: 1, username: 'admin', roles: ['admin'] }
    authStore.state.token = 'test-token'
    authStore.state.isAuthenticated = true
    localStorage.setItem('token', 'test-token')

    authStore.logout()

    expect(authStore.state.user).toBeNull()
    expect(authStore.state.token).toBeNull()
    expect(authStore.state.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('should check role correctly', () => {
    const authStore = useAuthStore()
    authStore.state.user = { id: 1, username: 'admin', roles: ['admin', 'user'] }

    expect(authStore.hasRole('admin')).toBe(true)
    expect(authStore.hasRole('superadmin')).toBe(false)
  })

  it('should check if user has any of the specified roles', () => {
    const authStore = useAuthStore()
    authStore.state.user = { id: 1, username: 'admin', roles: ['admin', 'user'] }

    expect(authStore.hasAnyRole(['admin', 'moderator'])).toBe(true)
    expect(authStore.hasAnyRole(['moderator', 'superadmin'])).toBe(false)
  })

  it('should check if user has all specified roles', () => {
    const authStore = useAuthStore()
    authStore.state.user = { id: 1, username: 'admin', roles: ['admin', 'user'] }

    expect(authStore.hasAllRoles(['admin', 'user'])).toBe(true)
    expect(authStore.hasAllRoles(['admin', 'user', 'moderator'])).toBe(false)
  })

  it('should load token from localStorage on initialization', () => {
    localStorage.setItem('token', 'saved-token')
    setActivePinia(createPinia())
    
    const authStore = useAuthStore()
    expect(authStore.state.token).toBe('saved-token')
  })
})