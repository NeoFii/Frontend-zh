const mockGetCurrentUser = jest.fn()
const mockRefreshSession = jest.fn()

jest.mock('@/lib/api/auth', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
  refreshSession: () => mockRefreshSession(),
}))

describe('fetchCurrentUser', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('refreshes the session and retries after /auth/me returns 401', async () => {
    const expectedResponse = {
      code: 200,
      message: 'success',
      data: {
        uid: 1,
        email: 'test@example.com',
        status: 1,
        email_verified_at: null,
        last_login_at: null,
        created_at: '2026-03-13T00:00:00+08:00',
      },
    }

    mockGetCurrentUser
      .mockRejectedValueOnce({ response: { status: 401 } })
      .mockResolvedValueOnce(expectedResponse)
    mockRefreshSession.mockResolvedValue({
      code: 200,
      message: 'success',
      data: {
        access_token: 'token',
        expires_in: 3600,
      },
    })

    const { fetchCurrentUser } = await import('@/hooks/useUser')

    await expect(fetchCurrentUser(true)).resolves.toEqual(expectedResponse)
    expect(mockRefreshSession).toHaveBeenCalledTimes(1)
    expect(mockGetCurrentUser).toHaveBeenCalledTimes(2)
  })
})
