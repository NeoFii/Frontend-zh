/**
 * 认证状态管理测试
 */

import { useAuthStore } from '@/stores/auth'
import { act } from '@testing-library/react'

jest.mock('zustand', () => {
  const actualZustand = jest.requireActual('zustand')
  return {
    ...actualZustand,
  }
})

describe('useAuthStore', () => {
  beforeEach(() => {
    // 重置 store
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      hydrated: false,
    })
  })

  it('初始状态应为未认证', () => {
    const { isAuthenticated, user, hydrated } = useAuthStore.getState()
    expect(isAuthenticated).toBe(false)
    expect(user).toBeNull()
    expect(hydrated).toBe(false)
  })

  it('login 方法应设置用户信息并标记为已认证', () => {
    const { login } = useAuthStore.getState()

    const testUser = {
      uid: 1,
      email: 'test@example.com',
      status: 1,
      email_verified_at: null,
      last_login_at: null,
      created_at: '2024-01-01T00:00:00Z',
    }

    act(() => {
      login(testUser)
    })

    const { isAuthenticated, user } = useAuthStore.getState()
    expect(isAuthenticated).toBe(true)
    expect(user).toEqual(testUser)
  })

  it('logout 方法应清除用户信息并标记为未认证', () => {
    const { login, logout } = useAuthStore.getState()

    const testUser = {
      uid: 1,
      email: 'test@example.com',
      status: 1,
      email_verified_at: null,
      last_login_at: null,
      created_at: '2024-01-01T00:00:00Z',
    }

    act(() => {
      login(testUser)
      logout()
    })

    const { isAuthenticated, user } = useAuthStore.getState()
    expect(isAuthenticated).toBe(false)
    expect(user).toBeNull()
  })

  it('应支持多个用户切换', () => {
    const { login, logout } = useAuthStore.getState()

    const user1 = {
      uid: 1,
      email: 'user1@example.com',
      status: 1,
      email_verified_at: null,
      last_login_at: null,
      created_at: '2024-01-01T00:00:00Z',
    }

    const user2 = {
      uid: 2,
      email: 'user2@example.com',
      status: 1,
      email_verified_at: null,
      last_login_at: null,
      created_at: '2024-01-01T00:00:00Z',
    }

    act(() => {
      login(user1)
    })

    expect(useAuthStore.getState().user?.email).toBe('user1@example.com')

    act(() => {
      login(user2)
    })

    expect(useAuthStore.getState().user?.email).toBe('user2@example.com')

    act(() => {
      logout()
    })

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })
})
