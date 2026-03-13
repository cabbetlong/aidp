import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initial state should be correct', () => {
    const userStore = useUserStore()
    expect(userStore.users).toEqual([])
    expect(userStore.loading).toBe(false)
    expect(userStore.searchKeyword).toBe('')
    expect(userStore.filteredUsers).toEqual([])
  })

  it('should fetch users successfully', async () => {
    const userStore = useUserStore()

    await userStore.fetchUsers()

    expect(userStore.loading).toBe(false)
    expect(userStore.users).toHaveLength(5)
    expect(userStore.users[0].username).toBe('admin')
    expect(userStore.users[0].email).toBe('admin@aidp.com')
  })

  it('should add user successfully', async () => {
    const userStore = useUserStore()
    await userStore.fetchUsers()

    const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      username: 'newuser',
      email: 'newuser@aidp.com',
      roles: ['user'],
      status: 'active',
    }

    const result = await userStore.addUser(newUser)

    expect(userStore.loading).toBe(false)
    expect(userStore.users).toHaveLength(6)
    expect(result.username).toBe('newuser')
    expect(result.email).toBe('newuser@aidp.com')
    expect(result.id).toBeTruthy()
    expect(result.createdAt).toBeTruthy()
    expect(result.updatedAt).toBeTruthy()
  })

  it('should update user successfully', async () => {
    const userStore = useUserStore()
    await userStore.fetchUsers()

    const updates: Partial<User> = {
      username: 'updated_admin',
      email: 'updated@aidp.com',
    }

    const result = await userStore.updateUser(1, updates)

    expect(userStore.loading).toBe(false)
    expect(result.username).toBe('updated_admin')
    expect(result.email).toBe('updated@aidp.com')
    expect(userStore.users[0].username).toBe('updated_admin')
    expect(userStore.users[0].email).toBe('updated@aidp.com')
  })

  it('should delete user successfully', async () => {
    const userStore = useUserStore()
    await userStore.fetchUsers()

    expect(userStore.users).toHaveLength(5)

    await userStore.deleteUser(1)

    expect(userStore.loading).toBe(false)
    expect(userStore.users).toHaveLength(4)
    expect(userStore.users.find((u) => u.id === 1)).toBeUndefined()
  })

  it('should search users by username', async () => {
    const userStore = useUserStore()
    await userStore.fetchUsers()

    userStore.searchUsers('admin')

    expect(userStore.searchKeyword).toBe('admin')
    expect(userStore.filteredUsers).toHaveLength(2)
    expect(userStore.filteredUsers[0].username).toBe('admin')
    expect(userStore.filteredUsers[1].username).toBe('manager')
  })

  it('should search users by email', async () => {
    const userStore = useUserStore()
    await userStore.fetchUsers()

    userStore.searchUsers('user1@aidp.com')

    expect(userStore.filteredUsers).toHaveLength(1)
    expect(userStore.filteredUsers[0].email).toBe('user1@aidp.com')
  })

  it('should search users by role', async () => {
    const userStore = useUserStore()
    await userStore.fetchUsers()

    userStore.searchUsers('admin')

    expect(userStore.filteredUsers).toHaveLength(2)
    expect(userStore.filteredUsers.every((u) => u.roles.includes('admin'))).toBe(true)
  })

  it('should return all users when search keyword is empty', async () => {
    const userStore = useUserStore()
    await userStore.fetchUsers()

    userStore.searchUsers('')

    expect(userStore.filteredUsers).toHaveLength(5)
    expect(userStore.filteredUsers).toEqual(userStore.users)
  })

  it('should filter users case-insensitively', async () => {
    const userStore = useUserStore()
    await userStore.fetchUsers()

    userStore.searchUsers('ADMIN')

    expect(userStore.filteredUsers).toHaveLength(2)
    expect(userStore.filteredUsers[0].username).toBe('admin')
    expect(userStore.filteredUsers[1].username).toBe('manager')
  })

  it('should return empty array when no users match search', async () => {
    const userStore = useUserStore()
    await userStore.fetchUsers()

    userStore.searchUsers('nonexistent')

    expect(userStore.filteredUsers).toHaveLength(0)
  })

  it('should update user that does not exist in local state', async () => {
    const userStore = useUserStore()
    await userStore.fetchUsers()

    const updates: Partial<User> = {
      username: 'ghost',
      email: 'ghost@aidp.com',
    }

    const result = await userStore.updateUser(999, updates)

    expect(result.username).toBe('ghost')
    expect(userStore.users.find((u) => u.id === 999)).toBeUndefined()
  })

  it('should handle loading state during fetchUsers', async () => {
    const userStore = useUserStore()

    const fetchPromise = userStore.fetchUsers()

    expect(userStore.loading).toBe(true)

    await fetchPromise

    expect(userStore.loading).toBe(false)
  })

  it('should handle loading state during addUser', async () => {
    const userStore = useUserStore()

    const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      username: 'test',
      email: 'test@test.com',
      roles: ['user'],
      status: 'active',
    }

    const addPromise = userStore.addUser(newUser)

    expect(userStore.loading).toBe(true)

    await addPromise

    expect(userStore.loading).toBe(false)
  })

  it('should handle loading state during updateUser', async () => {
    const userStore = useUserStore()

    const updatePromise = userStore.updateUser(1, { username: 'test' })

    expect(userStore.loading).toBe(true)

    await updatePromise

    expect(userStore.loading).toBe(false)
  })

  it('should handle loading state during deleteUser', async () => {
    const userStore = useUserStore()

    const deletePromise = userStore.deleteUser(1)

    expect(userStore.loading).toBe(true)

    await deletePromise

    expect(userStore.loading).toBe(false)
  })
})