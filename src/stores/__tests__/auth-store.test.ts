import { act } from '@testing-library/react'
import { useAuthStore } from '@/stores/auth'

jest.mock('zustand', () => {
  const actualZustand = jest.requireActual('zustand')
  return {
    ...actualZustand,
  }
})

const testUser = {
  uid: '1',
  email: 'test@example.com',
  status: 1,
  email_verified_at: null,
  last_login_at: null,
  created_at: '2024-01-01T00:00:00Z',
}

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      sessionStatus: 'unknown',
      isHydrated: false,
    })
  })

  it('starts with an unknown session', () => {
    const { user, sessionStatus, isHydrated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(sessionStatus).toBe('unknown')
    expect(isHydrated).toBe(false)
  })

  it('marks the session as authenticated on login', () => {
    act(() => {
      useAuthStore.getState().login(testUser)
    })

    const { user, sessionStatus } = useAuthStore.getState()
    expect(user).toEqual(testUser)
    expect(sessionStatus).toBe('authenticated')
  })

  it('marks the session as anonymous on logout', () => {
    act(() => {
      useAuthStore.getState().login(testUser)
      useAuthStore.getState().logout()
    })

    const { user, sessionStatus } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(sessionStatus).toBe('anonymous')
  })

  it('supports replacing the current user', () => {
    const nextUser = {
      ...testUser,
      uid: '2',
      email: 'user2@example.com',
    }

    act(() => {
      useAuthStore.getState().login(testUser)
      useAuthStore.getState().login(nextUser)
    })

    const { user, sessionStatus } = useAuthStore.getState()
    expect(user?.email).toBe('user2@example.com')
    expect(sessionStatus).toBe('authenticated')
  })

  it('can explicitly mark the session as anonymous', () => {
    act(() => {
      useAuthStore.getState().setSession('anonymous', null)
    })

    const { user, sessionStatus } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(sessionStatus).toBe('anonymous')
  })
})
