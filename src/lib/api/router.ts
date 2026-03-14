import { createApiClient, createHttpMethods } from '@/lib/api/client'

const ROUTER_API_BASE_URL =
  process.env.NEXT_PUBLIC_ROUTER_API_BASE_URL || 'http://localhost:8003/api/v1'

export interface RouterApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface RouterApiKey {
  id: number
  name: string
  token_preview: string
  is_active: boolean
  is_deleted?: boolean
  billing_mode: string
  balance: number | null
  daily_quota_tokens: number | null
  monthly_quota_tokens: number | null
  daily_quota_cost: number | null
  monthly_quota_cost: number | null
  rate_limit_rpm: number | null
  last_used_at: string | null
  created_at: string
  updated_at: string
}

export interface RouterUsageEvent {
  id: number
  request_id: string
  router_api_key_id: number | null
  provider_slug: string | null
  requested_model: string
  resolved_model: string
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  cost_input: number
  cost_output: number
  cost_total: number
  currency: string
  status_code: number
  error_code: string | null
  error_message: string | null
  latency_ms: number | null
  created_at: string
}

export interface RouterUsageSummary {
  total_requests: number
  success_requests: number
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  total_cost: number
  currency: string
}

export interface RouterBillingLedgerItem {
  id: number
  usage_event_id: number | null
  router_api_key_id: number | null
  direction: string
  amount: number
  currency: string
  balance_before: number | null
  balance_after: number | null
  description: string | null
  created_at: string
}

export interface RouterKeyListResponseData {
  items: RouterApiKey[]
}

export interface RouterKeySecretCreateResponseData {
  item: RouterApiKey
  api_key: string
}

export interface RouterKeySecretRevealResponseData {
  item: RouterApiKey
  api_key: string
}

export interface RouterDeleteResponseData {
  deleted: boolean
}

export interface RouterUsageEventsResponseData {
  items: RouterUsageEvent[]
  total: number
}

export interface RouterBillingLedgerResponseData {
  items: RouterBillingLedgerItem[]
  total: number
}

export interface RouterListParams {
  key_id?: number
  limit?: number
  offset?: number
}

const routerClient = createHttpMethods(
  createApiClient(ROUTER_API_BASE_URL, {
    refreshBaseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  })
)

export function listRouterKeys() {
  return routerClient.get<RouterApiResponse<RouterKeyListResponseData>>('/keys')
}

export function createRouterKey(name: string) {
  return routerClient.post<RouterApiResponse<RouterKeySecretCreateResponseData>>('/keys', { name })
}

export function updateRouterKey(
  keyId: number,
  payload: {
    name?: string
    is_active?: boolean
  }
) {
  return routerClient.patch<RouterApiResponse<RouterApiKey>>(`/keys/${keyId}`, payload)
}

export function deleteRouterKey(keyId: number) {
  return routerClient.delete<RouterApiResponse<RouterDeleteResponseData>>(`/keys/${keyId}`)
}

export function revealRouterKey(keyId: number) {
  return routerClient.post<RouterApiResponse<RouterKeySecretRevealResponseData>>(`/keys/${keyId}/reveal`)
}

export function fetchRouterUsageSummary(keyId?: number) {
  return routerClient.get<RouterApiResponse<RouterUsageSummary>>('/usage/summary', {
    params: keyId ? { key_id: keyId } : undefined,
  })
}

export function fetchRouterUsageEvents(params?: RouterListParams) {
  return routerClient.get<RouterApiResponse<RouterUsageEventsResponseData>>('/usage/events', {
    params,
  })
}

export function fetchRouterBillingLedger(params?: RouterListParams) {
  return routerClient.get<RouterApiResponse<RouterBillingLedgerResponseData>>('/billing/ledger', {
    params,
  })
}

export async function fetchAllRouterUsageEvents(options?: {
  key_id?: number
  limit?: number
  maxPages?: number
}) {
  const limit = options?.limit ?? 200
  const maxPages = options?.maxPages ?? 10
  const items: RouterUsageEvent[] = []

  for (let page = 0; page < maxPages; page += 1) {
    const offset = page * limit
    const response = await fetchRouterUsageEvents({
      key_id: options?.key_id,
      limit,
      offset,
    })
    const batch = response.data.items
    items.push(...batch)
    if (batch.length < limit || items.length >= response.data.total) {
      break
    }
  }

  return items
}
