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
  selected_model: string | null
  provider_slug: string | null
  prompt_tokens: number
  completion_tokens: number
  cached_tokens: number
  total_tokens: number
  cost: number
  status: number
  duration_ms: number | null
  is_stream: boolean
  routing_tier: number | null
  config_version: number | null
  config_source: string | null
  router_trace_id: string | null
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

interface BackendUsageAnalyticsOverview {
  total_requests: number
  success_requests: number
  success_rate: number
  total_cost: number
}

interface BackendUsageAnalyticsModel {
  effective_model: string
  request_count: number
  request_share: number
  total_cost: number
}

interface BackendUsageAnalyticsBucketCost {
  effective_model: string
  total_cost: number
}

interface BackendUsageAnalyticsBucket {
  bucket_start: string
  label: string
  costs: BackendUsageAnalyticsBucketCost[]
}

interface BackendUsageAnalyticsData {
  range: RouterUsageAnalyticsRange
  granularity: string
  start: string
  end: string
  currency: string
  overview: BackendUsageAnalyticsOverview
  models: BackendUsageAnalyticsModel[]
  buckets: BackendUsageAnalyticsBucket[]
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

interface BackendVoucherRedemptionItem {
  id: number
  code_prefix: string
  code_suffix: string
  amount: number
  status: number
  redeemed_at: string | null
  created_at: string
}

interface BackendPagedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

interface BackendTopupOrderItem {
  id: number
  order_no: string
  amount: number
  status: number
  payment_channel: string
  payment_no: string | null
  paid_at: string | null
  remark: string | null
  created_at: string
  updated_at: string
}

export interface TopupOrderItem {
  id: number
  order_no: string
  amount: number
  /** 订单状态 */
  status: number
  payment_channel: string
  payment_no: string | null
  paid_at: string | null
  remark: string | null
  created_at: string
  updated_at: string
}

export interface RouterApiKey {
  id: number
  name: string
  token_preview: string
  /** 1=active, 2=disabled, 3=expired, 4=exhausted */
  status: number
  is_active: boolean
  is_deleted?: boolean
  billing_mode: string
  balance: number | null
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
  api_key_id: number | null
  model_name: string
  selected_model: string | null
  provider_slug: string | null
  prompt_tokens: number
  completion_tokens: number
  cached_tokens: number
  total_tokens: number
  cost: number
  /** 1=success, 2=error, 3=refunded */
  status: number
  duration_ms: number | null
  is_stream: boolean
  routing_tier: number | null
  config_version: number | null
  config_source: string | null
  router_trace_id: string | null
  error_code: string | null
  error_msg: string | null
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

export type RouterUsageAnalyticsRange = '8h' | '24h' | '7d' | '30d'

export interface RouterUsageAnalyticsOverview {
  total_requests: number
  success_requests: number
  success_rate: number
  total_cost: number
}

export interface RouterUsageAnalyticsModel {
  effective_model: string
  request_count: number
  request_share: number
  total_cost: number
}

export interface RouterUsageAnalyticsBucketCost {
  effective_model: string
  total_cost: number
}

export interface RouterUsageAnalyticsBucket {
  bucket_start: string
  label: string
  costs: RouterUsageAnalyticsBucketCost[]
}

export interface RouterUsageAnalytics {
  range: RouterUsageAnalyticsRange
  granularity: string
  start: string
  end: string
  currency: string
  overview: RouterUsageAnalyticsOverview
  models: RouterUsageAnalyticsModel[]
  buckets: RouterUsageAnalyticsBucket[]
}

export interface RouterUsageStat {
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

export interface RouterBillingLedgerItem {
  id: number
  /** 1=TOPUP, 2=CONSUME, 3=REFUND, 4=FREEZE, 5=UNFREEZE, 6=ADMIN_ADJUST, 7=VOUCHER_REDEEM */
  type: number
  direction: string
  amount: number
  balance_before: number
  balance_after: number
  description: string | null
  ref_type: string | null
  ref_id: string | null
  remark: string | null
  created_at: string
}

export interface VoucherRedemptionItem {
  id: number
  code_prefix: string
  code_suffix: string
  amount: number
  status: number
  redeemed_at: string | null
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

export interface VoucherRedemptionsResponseData {
  items: VoucherRedemptionItem[]
  total: number
}

export interface RouterListParams {
  key_id?: number
  limit?: number
  offset?: number
  start?: string
  end?: string
  model_name?: string
  effective_model?: string
  type?: number
}

const CURRENCY = 'CNY'
const API_KEY_STATUS_ACTIVE = 1
const API_KEY_QUOTA_MODE_LIMITED = 2
const TX_TYPE_TOPUP = 1
const TX_TYPE_REFUND = 3
const TX_TYPE_ADMIN_ADJUST = 6
const TX_TYPE_VOUCHER_REDEEM = 7

export function apiKeyStatusMeta(status: number) {
  switch (status) {
    case 1:
      return { label: '启用中', tone: 'bg-emerald-50 text-emerald-700' }
    case 2:
      return { label: '已禁用', tone: 'bg-red-50 text-red-600' }
    case 3:
      return { label: '已过期', tone: 'bg-amber-50 text-amber-700' }
    case 4:
      return { label: '额度耗尽', tone: 'bg-orange-50 text-orange-700' }
    default:
      return { label: '未知', tone: 'bg-gray-100 text-gray-500' }
  }
}

export function transactionTypeMeta(type: number) {
  switch (type) {
    case 1:
      return { label: '充值', tone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-700' }
    case 2:
      return { label: '消费', tone: 'bg-gray-100 text-gray-700', iconTone: 'bg-gray-100 text-gray-700' }
    case 3:
      return { label: '退款', tone: 'bg-blue-50 text-blue-700', iconTone: 'bg-blue-100 text-blue-700' }
    case 4:
      return { label: '冻结', tone: 'bg-amber-50 text-amber-700', iconTone: 'bg-amber-100 text-amber-700' }
    case 5:
      return { label: '解冻', tone: 'bg-cyan-50 text-cyan-700', iconTone: 'bg-cyan-100 text-cyan-700' }
    case 6:
      return { label: '管理员调整', tone: 'bg-purple-50 text-purple-700', iconTone: 'bg-purple-100 text-purple-700' }
    case 7:
      return { label: '代金券', tone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-700' }
    default:
      return { label: '其他', tone: 'bg-gray-100 text-gray-500', iconTone: 'bg-gray-100 text-gray-500' }
  }
}

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
    ...(params?.start ? { start: params.start } : {}),
    ...(params?.end ? { end: params.end } : {}),
    ...(params?.model_name ? { model_name: params.model_name } : {}),
    ...(params?.effective_model ? { effective_model: params.effective_model } : {}),
    ...(typeof params?.type === 'number' ? { type: params.type } : {}),
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
    status: item.status,
    is_active: item.status === API_KEY_STATUS_ACTIVE,
    is_deleted: false,
    billing_mode: isLimited ? 'limited' : 'unlimited',
    balance: isLimited ? Math.max(quotaLimit - quotaUsed, 0) : null,
    quota_mode: item.quota_mode,
    quota_limit: quotaLimit,
    quota_used: quotaUsed,
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
    api_key_id: item.api_key_id,
    model_name: item.model_name,
    selected_model: item.selected_model,
    provider_slug: item.provider_slug,
    prompt_tokens: item.prompt_tokens,
    completion_tokens: item.completion_tokens,
    cached_tokens: item.cached_tokens,
    total_tokens: item.total_tokens,
    cost: centsToCurrency(item.cost),
    status: item.status,
    duration_ms: item.duration_ms,
    is_stream: item.is_stream,
    routing_tier: item.routing_tier,
    config_version: item.config_version,
    config_source: item.config_source,
    router_trace_id: item.router_trace_id,
    error_code: item.error_code,
    error_msg: item.error_msg,
    created_at: item.created_at,
  }
}

function normalizeUsageStat(item: BackendUsageStatItem): RouterUsageStat {
  return {
    stat_hour: item.stat_hour,
    request_count: item.request_count,
    success_count: item.success_count,
    error_count: item.error_count,
    prompt_tokens: item.prompt_tokens,
    completion_tokens: item.completion_tokens,
    cached_tokens: item.cached_tokens,
    total_tokens: item.total_tokens,
    total_cost: centsToCurrency(item.total_cost),
  }
}

function normalizeUsageSummary(items: RouterUsageStat[]): RouterUsageSummary {
  return items.reduce<RouterUsageSummary>(
    (summary, item) => {
      summary.total_requests += item.request_count
      summary.success_requests += item.success_count
      summary.prompt_tokens += item.prompt_tokens
      summary.completion_tokens += item.completion_tokens
      summary.total_tokens += item.total_tokens
      summary.total_cost += item.total_cost
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

function normalizeUsageAnalytics(data: BackendUsageAnalyticsData): RouterUsageAnalytics {
  return {
    range: data.range,
    granularity: data.granularity,
    start: data.start,
    end: data.end,
    currency: data.currency || CURRENCY,
    overview: {
      total_requests: data.overview.total_requests,
      success_requests: data.overview.success_requests,
      success_rate: data.overview.success_rate,
      total_cost: centsToCurrency(data.overview.total_cost),
    },
    models: data.models.map((item) => ({
      effective_model: item.effective_model,
      request_count: item.request_count,
      request_share: item.request_share,
      total_cost: centsToCurrency(item.total_cost),
    })),
    buckets: data.buckets.map((bucket) => ({
      bucket_start: bucket.bucket_start,
      label: bucket.label,
      costs: bucket.costs.map((cost) => ({
        effective_model: cost.effective_model,
        total_cost: centsToCurrency(cost.total_cost),
      })),
    })),
  }
}

function transactionDirection(type: number) {
  if (type === TX_TYPE_TOPUP || type === TX_TYPE_REFUND || type === TX_TYPE_VOUCHER_REDEEM) {
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
    type: item.type,
    direction: transactionDirection(item.type),
    amount: centsToCurrency(item.amount),
    balance_before: centsToCurrency(item.balance_before),
    balance_after: centsToCurrency(item.balance_after),
    description: transactionDescription(item),
    ref_type: item.ref_type,
    ref_id: item.ref_id,
    remark: item.remark,
    created_at: item.created_at,
  }
}

function normalizeVoucherRedemption(item: BackendVoucherRedemptionItem): VoucherRedemptionItem {
  return {
    id: item.id,
    code_prefix: item.code_prefix,
    code_suffix: item.code_suffix,
    amount: centsToCurrency(item.amount),
    status: item.status,
    redeemed_at: item.redeemed_at,
    created_at: item.created_at,
  }
}

export interface ApiKeyCreatePayload {
  name: string
  quota_mode?: number
  quota_limit?: number
  allowed_models?: string | null
  allow_ips?: string | null
  expires_at?: string | null
}

export interface ApiKeyUpdatePayload {
  name?: string
  quota_limit?: number
  reset_quota_used?: boolean
  allowed_models?: string | null
  allow_ips?: string | null
  expires_at?: string | null
}

export function listRouterKeys() {
  return http.get<RouterApiResponse<BackendApiKeyItem[]>>('/keys').then((response) => ({
    ...response,
    data: {
      items: response.data.map(normalizeApiKey),
    },
  }))
}

export function createRouterKey(payload: ApiKeyCreatePayload) {
  return http
    .post<RouterApiResponse<BackendApiKeyCreateData>>('/keys', payload)
    .then((response) => ({
      ...response,
      data: {
        item: normalizeApiKey(response.data.item),
        api_key: response.data.key,
      },
    }))
}

export function updateRouterKey(keyId: number, payload: ApiKeyUpdatePayload) {
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

export function fetchRouterUsageAnalytics(range: RouterUsageAnalyticsRange) {
  return http
    .get<RouterApiResponse<BackendUsageAnalyticsData>>('/billing/usage/analytics', {
      params: { range },
    })
    .then((response) => ({
      ...response,
      data: normalizeUsageAnalytics(response.data),
    }))
}

export function fetchRouterUsageSummary(keyId?: number) {
  return http
    .get<RouterApiResponse<BackendUsageStatItem[]>>('/billing/usage', {
      params: keyId ? { api_key_id: keyId } : undefined,
    })
    .then((response) => ({
      ...response,
      data: normalizeUsageSummary(response.data.map(normalizeUsageStat)),
    }))
}

export function fetchRouterUsageStats(params: { start: string; end: string; apiKeyId?: number }) {
  return http
    .get<RouterApiResponse<BackendUsageStatItem[]>>('/billing/usage', {
      params: {
        start: params.start,
        end: params.end,
        ...(typeof params.apiKeyId === 'number' ? { api_key_id: params.apiKeyId } : {}),
      },
    })
    .then((response) => ({
      ...response,
      data: response.data.map(normalizeUsageStat),
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

export function fetchVoucherRedemptions(params?: RouterListParams) {
  return http
    .get<RouterApiResponse<BackendPagedResponse<BackendVoucherRedemptionItem>>>(
      '/billing/vouchers/redemptions',
      {
        params: toPagedParams(params),
      }
    )
    .then((response) => ({
      ...response,
      data: {
        items: response.data.items.map(normalizeVoucherRedemption),
        total: response.data.total,
      },
    }))
}

export function fetchTopupOrders(params?: { page?: number; page_size?: number }) {
  return http
    .get<RouterApiResponse<BackendPagedResponse<BackendTopupOrderItem>>>('/billing/topup-orders', {
      params: { page: params?.page ?? 1, page_size: params?.page_size ?? 10 },
    })
    .then((response) => ({
      ...response,
      data: {
        items: response.data.items.map((item): TopupOrderItem => ({
          ...item,
          amount: centsToCurrency(item.amount),
        })),
        total: response.data.total,
      },
    }))
}

export async function fetchAllRouterUsageEvents(options?: {
  key_id?: number
  limit?: number
  maxPages?: number
}) {
  const limit = options?.limit ?? 100
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

export interface VoucherRedeemResult {
  id: number
  amount: number
  status: number
  redeemed_at: string | null
}

export function redeemVoucher(code: string) {
  return http
    .post<RouterApiResponse<{ id: number; amount: number; status: number; redeemed_at: string | null }>>(
      '/billing/vouchers/redeem',
      { code }
    )
    .then((response) => ({
      ...response,
      data: {
        id: response.data.id,
        amount: centsToCurrency(response.data.amount),
        status: response.data.status,
        redeemed_at: response.data.redeemed_at,
      } as VoucherRedeemResult,
    }))
}
