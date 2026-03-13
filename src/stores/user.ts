import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const searchKeyword = ref('')

  const filteredUsers = computed(() => {
    if (!searchKeyword.value) {
      return users.value
    }
    const keyword = searchKeyword.value.toLowerCase()
    return users.value.filter(
      (user) =>
        user.username.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.roles.some((role) => role.toLowerCase().includes(keyword))
    )
  })

  async function fetchUsers(): Promise<void> {
    loading.value = true
    try {
      const response = await mockFetchUsersApi()
      users.value = response
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    loading.value = true
    try {
      const newUser = await mockAddUserApi(user)
      users.value.push(newUser)
      return newUser
    } catch (error) {
      console.error('Failed to add user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateUser(id: number, user: Partial<User>): Promise<User> {
    loading.value = true
    try {
      const updatedUser = await mockUpdateUserApi(id, user)
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      return updatedUser
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(id: number): Promise<void> {
    loading.value = true
    try {
      await mockDeleteUserApi(id)
      users.value = users.value.filter((u) => u.id !== id)
    } catch (error) {
      console.error('Failed to delete user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  function searchUsers(keyword: string): void {
    searchKeyword.value = keyword
  }

  return {
    users,
    loading,
    searchKeyword,
    filteredUsers,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    searchUsers,
  }
})

async function mockFetchUsersApi(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    {
      id: 1,
      username: 'admin',
      email: 'admin@aidp.com',
      roles: ['admin'],
      status: 'active',
      createdAt: Date.now() - 86400000 * 30,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 2,
      username: 'user1',
      email: 'user1@aidp.com',
      roles: ['user'],
      status: 'active',
      createdAt: Date.now() - 86400000 * 15,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 3,
      username: 'user2',
      email: 'user2@aidp.com',
      roles: ['user'],
      status: 'inactive',
      createdAt: Date.now() - 86400000 * 7,
      updatedAt: Date.now() - 86400000 * 3,
    },
    {
      id: 4,
      username: 'manager',
      email: 'manager@aidp.com',
      roles: ['admin', 'user'],
      status: 'active',
      createdAt: Date.now() - 86400000 * 20,
      updatedAt: Date.now() - 86400000 * 5,
    },
    {
      id: 5,
      username: 'guest',
      email: 'guest@aidp.com',
      roles: ['user'],
      status: 'inactive',
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 1,
    },
  ]
}

async function mockAddUserApi(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newUser: User = {
    ...user,
    id: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  return newUser
}

async function mockUpdateUserApi(id: number, user: Partial<User>): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const updatedUser: User = {
    id,
    username: user.username || '',
    email: user.email,
    roles: user.roles || [],
    avatar: user.avatar,
    status: user.status || 'active',
    createdAt: user.createdAt,
    updatedAt: Date.now(),
  }
  return updatedUser
}

async function mockDeleteUserApi(_id: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))
}