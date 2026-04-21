import { http } from './index'

export interface RouterApiResponse<T> {
  code: number
  message: string
  data: T
}

interface BackendApiKeyItem {
  id: number
  key_prefix: string
  name: string
  status: number
  quota_mode: number
  quota_limit: number
  quota_used: number
  allowed_models: string | null
  allow_ips: string | null
  expires_at: string | null
  last_used_at: string | null
  created_at: string
  updated_at: string
}

interface BackendApiKeyCreateData {
  key: string
  item: BackendApiKeyItem
}

interface BackendBalanceData {
  balance: number
  frozen_amount: number
  used_amount: number
  total_requests: number
  total_tokens: number
  available_balance?: number
}

interface BackendUsageLogItem {
  id: number
  request_id: string
  api_key_id: number | null
  model_name: string
  prompt_tokens: number
  completion_tokens: number
  cached_tokens: number
  total_tokens: number
  cost: number
  status: number
  duration_ms: number | null
  is_stream: boolean
  error_code: string | null
  error_msg: string | null
  created_at: string
}

interface BackendUsageStatItem {
  id: number
  api_key_id: number | null
  model_name: string
  stat_hour: string
  request_count: number
  success_count: number
  error_count: number
  prompt_tokens: number
  completion_tokens: number
  cached_tokens: number
  total_tokens: number
  total_cost: number
}

interface BackendBalanceTransactionItem {
  id: number
  type: number
  amount: number
  balance_before: number
  balance_after: number
  ref_type: string | null
  ref_id: string | null
  remark: string | null
  created_at: string
}

interface BackendPagedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface RouterApiKey {
  id: number
  name: string
  token_preview: string
  is_active: boolean
  is_deleted?: boolean
  billing_mode: string
  balance: number | null
  quota_mode: number
  quota_limit: number
  quota_used: number
  daily_quota_tokens: number | null
  monthly_quota_tokens: number | null
  daily_quota_cost: number | null
  monthly_quota_cost: number | null
  rate_limit_rpm: number | null
  allowed_models: string | null
  allow_ips: string | null
  expires_at: string | null
  last_used_at: string | null
  created_at: string
  updated_at: string
}

export interface RouterBalance {
  balance: number
  frozen_amount: number
  used_amount: number
  available_balance: number
  total_requests: number
  total_tokens: number
  currency: string
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
  ref_type?: string | null
  ref_id?: string | null
  created_at: string
}

export interface RouterKeyListResponseData {
  items: RouterApiKey[]
}

export interface RouterKeySecretCreateResponseData {
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

const CURRENCY = 'CNY'
const API_KEY_STATUS_ACTIVE = 1
const API_KEY_QUOTA_MODE_LIMITED = 2
const TX_TYPE_TOPUP = 1
const TX_TYPE_REFUND = 3
const TX_TYPE_ADMIN_ADJUST = 6

function centsToCurrency(value: number | null | undefined) {
  return (value ?? 0) / 100
}

function toPagedParams(params?: RouterListParams) {
  const pageSize = params?.limit ?? 50
  const offset = params?.offset ?? 0
  return {
    page: Math.floor(offset / pageSize) + 1,
    page_size: pageSize,
    ...(params?.key_id ? { api_key_id: params.key_id } : {}),
  }
}

function normalizeApiKey(item: BackendApiKeyItem): RouterApiKey {
  const quotaLimit = centsToCurrency(item.quota_limit)
  const quotaUsed = centsToCurrency(item.quota_used)
  const isLimited = item.quota_mode === API_KEY_QUOTA_MODE_LIMITED

  return {
    id: item.id,
    name: item.name,
    token_preview: `${item.key_prefix}...`,
    is_active: item.status === API_KEY_STATUS_ACTIVE,
    is_deleted: false,
    billing_mode: isLimited ? 'limited' : 'unlimited',
    balance: isLimited ? Math.max(quotaLimit - quotaUsed, 0) : null,
    quota_mode: item.quota_mode,
    quota_limit: quotaLimit,
    quota_used: quotaUsed,
    daily_quota_tokens: null,
    monthly_quota_tokens: null,
    daily_quota_cost: null,
    monthly_quota_cost: isLimited ? quotaLimit : null,
    rate_limit_rpm: null,
    allowed_models: item.allowed_models,
    allow_ips: item.allow_ips,
    expires_at: item.expires_at,
    last_used_at: item.last_used_at,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }
}

function normalizeBalance(data: BackendBalanceData): RouterBalance {
  const availableBalance = data.available_balance ?? data.balance - data.frozen_amount

  return {
    balance: centsToCurrency(data.balance),
    frozen_amount: centsToCurrency(data.frozen_amount),
    used_amount: centsToCurrency(data.used_amount),
    available_balance: centsToCurrency(availableBalance),
    total_requests: data.total_requests,
    total_tokens: data.total_tokens,
    currency: CURRENCY,
  }
}

function normalizeUsageLog(item: BackendUsageLogItem): RouterUsageEvent {
  return {
    id: item.id,
    request_id: item.request_id,
    router_api_key_id: item.api_key_id,
    provider_slug: null,
    requested_model: item.model_name,
    resolved_model: item.model_name,
    prompt_tokens: item.prompt_tokens,
    completion_tokens: item.completion_tokens,
    total_tokens: item.total_tokens,
    cost_input: 0,
    cost_output: 0,
    cost_total: centsToCurrency(item.cost),
    currency: CURRENCY,
    status_code: item.status,
    error_code: item.error_code,
    error_message: item.error_msg,
    latency_ms: item.duration_ms,
    created_at: item.created_at,
  }
}

function normalizeUsageSummary(items: BackendUsageStatItem[]): RouterUsageSummary {
  return items.reduce<RouterUsageSummary>(
    (summary, item) => {
      summary.total_requests += item.request_count
      summary.success_requests += item.success_count
      summary.prompt_tokens += item.prompt_tokens
      summary.completion_tokens += item.completion_tokens
      summary.total_tokens += item.total_tokens
      summary.total_cost += centsToCurrency(item.total_cost)
      return summary
    },
    {
      total_requests: 0,
      success_requests: 0,
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
      total_cost: 0,
      currency: CURRENCY,
    }
  )
}

function transactionDirection(type: number) {
  if (type === TX_TYPE_TOPUP || type === TX_TYPE_REFUND) {
    return 'credit'
  }
  if (type === TX_TYPE_ADMIN_ADJUST) {
    return 'adjust'
  }
  return 'debit'
}

function transactionDescription(item: BackendBalanceTransactionItem) {
  if (item.remark) {
    return item.remark
  }
  if (item.ref_type && item.ref_id) {
    return `${item.ref_type} #${item.ref_id}`
  }
  return item.ref_type
}

function normalizeTransaction(item: BackendBalanceTransactionItem): RouterBillingLedgerItem {
  return {
    id: item.id,
    usage_event_id: null,
    router_api_key_id: null,
    direction: transactionDirection(item.type),
    amount: centsToCurrency(item.amount),
    currency: CURRENCY,
    balance_before: centsToCurrency(item.balance_before),
    balance_after: centsToCurrency(item.balance_after),
    description: transactionDescription(item),
    ref_type: item.ref_type,
    ref_id: item.ref_id,
    created_at: item.created_at,
  }
}

export function listRouterKeys() {
  return http.get<RouterApiResponse<BackendApiKeyItem[]>>('/keys').then((response) => ({
    ...response,
    data: {
      items: response.data.map(normalizeApiKey),
    },
  }))
}

export function createRouterKey(name: string) {
  return http
    .post<RouterApiResponse<BackendApiKeyCreateData>>('/keys', { name })
    .then((response) => ({
      ...response,
      data: {
        item: normalizeApiKey(response.data.item),
        api_key: response.data.key,
      },
    }))
}

export function updateRouterKey(
  keyId: number,
  payload: {
    name?: string
  }
) {
  return http
    .patch<RouterApiResponse<BackendApiKeyItem>>(`/keys/${keyId}`, payload)
    .then((response) => ({
      ...response,
      data: normalizeApiKey(response.data),
    }))
}

export function disableRouterKey(keyId: number) {
  return http.post<RouterApiResponse<null>>(`/keys/${keyId}/disable`)
}

export function deleteRouterKey(keyId: number) {
  return http.delete<RouterApiResponse<null>>(`/keys/${keyId}`).then((response) => ({
    ...response,
    data: {
      deleted: true,
    },
  }))
}

export function fetchRouterBalance() {
  return http.get<RouterApiResponse<BackendBalanceData>>('/billing/balance').then((response) => ({
    ...response,
    data: normalizeBalance(response.data),
  }))
}

export function fetchRouterUsageSummary(keyId?: number) {
  return http
    .get<RouterApiResponse<BackendUsageStatItem[]>>('/billing/usage', {
      params: keyId ? { api_key_id: keyId } : undefined,
    })
    .then((response) => ({
      ...response,
      data: normalizeUsageSummary(response.data),
    }))
}

export function fetchRouterUsageEvents(params?: RouterListParams) {
  return http
    .get<RouterApiResponse<BackendPagedResponse<BackendUsageLogItem>>>('/billing/usage/logs', {
      params: toPagedParams(params),
    })
    .then((response) => ({
      ...response,
      data: {
        items: response.data.items.map(normalizeUsageLog),
        total: response.data.total,
      },
    }))
}

export function fetchRouterBillingLedger(params?: RouterListParams) {
  return http
    .get<RouterApiResponse<BackendPagedResponse<BackendBalanceTransactionItem>>>(
      '/billing/transactions',
      {
        params: toPagedParams(params),
      }
    )
    .then((response) => ({
      ...response,
      data: {
        items: response.data.items.map(normalizeTransaction),
        total: response.data.total,
      },
    }))
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
