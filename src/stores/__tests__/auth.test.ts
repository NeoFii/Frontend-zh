/**
 * 认证状态管理测试
 */

import { act } from '@testing-library/react'
import { useAuthStore } from '@/stores/auth'

const testUser = {
  uid: '1',
  email: 'test@example.com',
  status: 1,
  email_verified_at: null,
  last_login_at: null,
  created_at: '2024-01-01T00:00:00Z',
}

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
      user: null,
      sessionStatus: 'unknown',
      isHydrated: false,
    })
  })

  it('初始状态应为未认证', () => {
    const { user, sessionStatus, isHydrated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(sessionStatus).toBe('unknown')
    expect(isHydrated).toBe(false)
  })

  it('login 方法应设置用户信息并标记为已认证', () => {
    const { login } = useAuthStore.getState()

    act(() => {
      login(testUser)
    })

    const { sessionStatus, user } = useAuthStore.getState()
    expect(sessionStatus).toBe('authenticated')
    expect(user).toEqual(testUser)
  })

  it('logout 方法应清除用户信息并标记为未认证', () => {
    const { login, logout } = useAuthStore.getState()

    act(() => {
      login(testUser)
      logout()
    })

    const { sessionStatus, user } = useAuthStore.getState()
    expect(sessionStatus).toBe('anonymous')
    expect(user).toBeNull()
  })

  it('应支持多个用户切换', () => {
    const { login, logout } = useAuthStore.getState()

    const user1 = {
      uid: '1',
      email: 'user1@example.com',
      status: 1,
      email_verified_at: null,
      last_login_at: null,
      created_at: '2024-01-01T00:00:00Z',
    }

    const user2 = {
      uid: '2',
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

    expect(useAuthStore.getState().sessionStatus).toBe('anonymous')
  })
})
