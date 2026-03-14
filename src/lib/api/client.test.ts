const mockLogout = jest.fn()
const mockClearAllTokens = jest.fn()
const mockGetAccessToken = jest.fn()
const mockIsAccessTokenExpiringSoon = jest.fn()
const mockSetAccessToken = jest.fn()
const mockAxiosPost = jest.fn()

let responseRejectedHandler:
  | ((error: {
      config?: Record<string, unknown>
      response?: { status?: number }
    }) => Promise<unknown>)
  | undefined
let requestFulfilledHandler:
  | ((config: {
      baseURL?: string
      url?: string
      headers?: Record<string, string>
    }) => Promise<unknown>)
  | undefined

const mockApiClient = Object.assign(jest.fn(), {
  interceptors: {
    request: {
      use: jest.fn((onFulfilled) => {
        requestFulfilledHandler = onFulfilled
      }),
    },
    response: {
      use: jest.fn((_, onRejected) => {
        responseRejectedHandler = onRejected
      }),
    },
  },
})

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => mockApiClient),
    post: mockAxiosPost,
  },
}))

jest.mock('@/lib/token', () => ({
  clearAllTokens: () => mockClearAllTokens(),
  getAccessToken: () => mockGetAccessToken(),
  isAccessTokenExpiringSoon: () => mockIsAccessTokenExpiringSoon(),
  setAccessToken: (token: string, expiresIn: number) => mockSetAccessToken(token, expiresIn),
}))

jest.mock('@/stores/auth', () => ({
  useAuthStore: {
    getState: () => ({
      logout: mockLogout,
    }),
  },
}))

describe('createApiClient', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    responseRejectedHandler = undefined
    mockGetAccessToken.mockReturnValue(null)
    mockIsAccessTokenExpiringSoon.mockReturnValue(true)
    requestFulfilledHandler = undefined
  })

  it('does not try to refresh tokens before calling /auth/me', async () => {
    const { createApiClient } = await import('@/lib/api/client')
    createApiClient('http://localhost:8000/api/v1')

    expect(requestFulfilledHandler).toBeDefined()

    const config = {
      baseURL: 'http://localhost:8000/api/v1',
      url: '/auth/me',
      headers: {},
    }

    await expect(requestFulfilledHandler?.(config)).resolves.toEqual(config)
    expect(mockAxiosPost).not.toHaveBeenCalled()
    expect(mockSetAccessToken).not.toHaveBeenCalled()
  })

  it('does not force logout when /auth/me returns 401', async () => {
    const { createApiClient } = await import('@/lib/api/client')
    createApiClient('http://localhost:8000/api/v1')

    expect(responseRejectedHandler).toBeDefined()

    const error = {
      config: {
        baseURL: 'http://localhost:8000/api/v1',
        url: '/auth/me',
      },
      response: {
        status: 401,
      },
    }

    await expect(responseRejectedHandler?.(error)).rejects.toBe(error)
    expect(mockAxiosPost).not.toHaveBeenCalled()
    expect(mockClearAllTokens).not.toHaveBeenCalled()
    expect(mockLogout).not.toHaveBeenCalled()
  })

  it('does not force logout when /auth/login returns 401', async () => {
    const { createApiClient } = await import('@/lib/api/client')
    createApiClient('http://localhost:8000/api/v1')

    expect(responseRejectedHandler).toBeDefined()

    const error = {
      config: {
        baseURL: 'http://localhost:8000/api/v1',
        url: '/auth/login',
      },
      response: {
        status: 401,
      },
    }

    await expect(responseRejectedHandler?.(error)).rejects.toBe(error)
    expect(mockAxiosPost).not.toHaveBeenCalled()
    expect(mockClearAllTokens).not.toHaveBeenCalled()
    expect(mockLogout).not.toHaveBeenCalled()
  })
})
