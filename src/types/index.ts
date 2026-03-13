export interface User {
  id: number
  username: string
  email?: string
  roles: string[]
  avatar?: string
  status?: 'active' | 'inactive'
  createdAt?: number
  updatedAt?: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  username: string
  password: string
  captcha?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export interface MenuItem {
  path: string
  name: string
  icon?: string
  meta?: {
    title?: string
    roles?: string[]
    hidden?: boolean
  }
}

export interface I18nLocale {
  code: string
  name: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
}