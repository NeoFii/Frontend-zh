describe('proxy config', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('falls back to same-origin public paths and loopback internal targets', async () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL
    delete process.env.NEXT_PUBLIC_API_URL
    delete process.env.NEXT_PUBLIC_MODEL_CATALOG_API_BASE_URL
    delete process.env.NEXT_PUBLIC_ROUTER_OPENAI_BASE_URL
    delete process.env.API_URL
    delete process.env.ROUTER_API_URL

    const {
      resolveModelCatalogApiBaseUrl,
      resolveProxyTargets,
      resolvePublicApiBaseUrl,
      resolveRouterOpenAIBaseUrl,
    } = await import('@/lib/proxy-config')

    expect(resolvePublicApiBaseUrl()).toBe('/api/v1')
    expect(resolveModelCatalogApiBaseUrl()).toBe('/api/v1')
    expect(resolveRouterOpenAIBaseUrl()).toBe('/router-api/v1')
    expect(resolveProxyTargets()).toEqual({
      apiUrl: 'http://127.0.0.1:8000',
      routerApiUrl: 'http://127.0.0.1:8003',
    })
  })

  it('normalizes configured URLs by trimming whitespace and trailing slashes', async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = ' https://example.com/api/v1/ '
    process.env.NEXT_PUBLIC_MODEL_CATALOG_API_BASE_URL = ' https://models.example.com/catalog/ '
    process.env.NEXT_PUBLIC_ROUTER_OPENAI_BASE_URL = ' https://gateway.example.com/v1/ '
    process.env.API_URL = ' http://127.0.0.1:9001/ '
    process.env.ROUTER_API_URL = ' http://127.0.0.1:9003/ '

    const {
      resolveModelCatalogApiBaseUrl,
      resolveProxyTargets,
      resolvePublicApiBaseUrl,
      resolveRouterOpenAIBaseUrl,
    } = await import('@/lib/proxy-config')

    expect(resolvePublicApiBaseUrl()).toBe('https://example.com/api/v1')
    expect(resolveModelCatalogApiBaseUrl()).toBe('https://models.example.com/catalog')
    expect(resolveRouterOpenAIBaseUrl()).toBe('https://gateway.example.com/v1')
    expect(resolveProxyTargets()).toEqual({
      apiUrl: 'http://127.0.0.1:9001',
      routerApiUrl: 'http://127.0.0.1:9003',
    })
  })
})
