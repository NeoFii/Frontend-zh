const DEFAULT_PUBLIC_API_BASE_URL = '/api/v1'
const DEFAULT_PUBLIC_ROUTER_OPENAI_BASE_URL = 'http://47.99.200.103:8003/v1'
const DEFAULT_PUBLIC_ROUTER_ANTHROPIC_BASE_URL = 'http://47.99.200.103:8003/v1/anthropic'
const DEFAULT_INTERNAL_API_URL = 'http://127.0.0.1:8000'
const DEFAULT_INTERNAL_ROUTER_API_URL = 'http://127.0.0.1:8003'

function normalizeConfiguredUrl(value, fallback) {
  const trimmedValue = typeof value === 'string' ? value.trim() : ''
  return trimmedValue ? trimmedValue.replace(/\/+$/, '') : fallback
}

function resolvePublicApiBaseUrl(env = process.env) {
  return normalizeConfiguredUrl(env.NEXT_PUBLIC_API_BASE_URL, DEFAULT_PUBLIC_API_BASE_URL)
}

function resolveModelCatalogApiBaseUrl(env = process.env) {
  const configuredModelCatalogApiBaseUrl = normalizeConfiguredUrl(
    env.NEXT_PUBLIC_MODEL_CATALOG_API_BASE_URL,
    ''
  )
  if (configuredModelCatalogApiBaseUrl) {
    return configuredModelCatalogApiBaseUrl
  }

  const configuredPublicApiBaseUrl = normalizeConfiguredUrl(env.NEXT_PUBLIC_API_BASE_URL, '')
  if (configuredPublicApiBaseUrl) {
    return configuredPublicApiBaseUrl
  }

  const configuredPublicApiUrl = normalizeConfiguredUrl(env.NEXT_PUBLIC_API_URL, '')
  if (configuredPublicApiUrl) {
    return `${configuredPublicApiUrl}/api/v1`
  }

  return DEFAULT_PUBLIC_API_BASE_URL
}

function resolveRouterOpenAIBaseUrl(env = process.env) {
  return normalizeConfiguredUrl(
    env.NEXT_PUBLIC_ROUTER_OPENAI_BASE_URL,
    DEFAULT_PUBLIC_ROUTER_OPENAI_BASE_URL
  )
}

function resolveRouterAnthropicBaseUrl(env = process.env) {
  return normalizeConfiguredUrl(
    env.NEXT_PUBLIC_ROUTER_ANTHROPIC_BASE_URL,
    DEFAULT_PUBLIC_ROUTER_ANTHROPIC_BASE_URL
  )
}

function resolveProxyTargets(env = process.env) {
  return {
    apiUrl: normalizeConfiguredUrl(env.API_URL, DEFAULT_INTERNAL_API_URL),
    routerApiUrl: normalizeConfiguredUrl(env.ROUTER_API_URL, DEFAULT_INTERNAL_ROUTER_API_URL),
  }
}

module.exports = {
  DEFAULT_INTERNAL_API_URL,
  DEFAULT_INTERNAL_ROUTER_API_URL,
  DEFAULT_PUBLIC_API_BASE_URL,
  DEFAULT_PUBLIC_ROUTER_OPENAI_BASE_URL,
  DEFAULT_PUBLIC_ROUTER_ANTHROPIC_BASE_URL,
  normalizeConfiguredUrl,
  resolveModelCatalogApiBaseUrl,
  resolveProxyTargets,
  resolvePublicApiBaseUrl,
  resolveRouterAnthropicBaseUrl,
  resolveRouterOpenAIBaseUrl,
}
