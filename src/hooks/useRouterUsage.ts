import useSWR from 'swr'
import {
  fetchAllRouterUsageEvents,
  fetchRouterBalance,
  fetchRouterBillingLedger,
  fetchRouterUsageAnalytics,
  fetchRouterUsageEvents,
  fetchRouterUsageStats,
  fetchRouterUsageSummary,
  fetchVoucherRedemptions,
} from '@/lib/api/router'
import type { RouterUsageAnalyticsRange } from '@/lib/api/router'

type ErrorWithStatus = {
  response?: {
    status?: number
  }
}

function getResponseStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined
  }

  return Number((error as ErrorWithStatus).response?.status)
}

export function useRouterBalance() {
  const { data, error, isLoading, mutate } = useSWR('router-balance', fetchRouterBalance, {
    revalidateOnFocus: false,
    dedupingInterval: 15000,
  })

  return {
    balance: data?.data ?? null,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useRouterUsageSummary(keyId?: number) {
  const cacheKey = keyId ? ['router-usage-summary', keyId] : ['router-usage-summary']
  const { data, error, isLoading, mutate } = useSWR(cacheKey, () => fetchRouterUsageSummary(keyId), {
    revalidateOnFocus: false,
    dedupingInterval: 15000,
  })

  return {
    summary: data?.data ?? null,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useRouterUsageAnalytics(range: RouterUsageAnalyticsRange) {
  const cacheKey = ['router-usage-analytics', range]
  const { data, error, isLoading, mutate } = useSWR(cacheKey, () => fetchRouterUsageAnalytics(range), {
    revalidateOnFocus: false,
    dedupingInterval: 15000,
    keepPreviousData: true,
    onErrorRetry: (fetchError, _key, _config, revalidate, context) => {
      if (getResponseStatus(fetchError) === 404 || context.retryCount >= 3) {
        return
      }

      setTimeout(() => revalidate({ retryCount: context.retryCount }), 5000)
    },
  })
  const status = getResponseStatus(error)

  return {
    analytics: data?.data ?? null,
    isLoading,
    isError: error,
    isUnsupported: status === 404,
    status,
    mutate,
  }
}

export function useRouterUsageStats(options?: { start?: string; end?: string; apiKeyId?: number }) {
  const cacheKey = options?.start && options?.end
    ? ['router-usage-stats', options.start, options.end, options.apiKeyId ?? 'all']
    : null

  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () =>
      fetchRouterUsageStats({
        start: options!.start!,
        end: options!.end!,
        apiKeyId: options?.apiKeyId,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 15000,
      keepPreviousData: true,
    }
  )

  return {
    stats: data?.data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useRouterUsageEvents(options?: {
  keyId?: number
  limit?: number
  maxPages?: number
  start?: string
  end?: string
  effectiveModel?: string
  enabled?: boolean
}) {
  const enabled = options?.enabled ?? true
  const cacheKey = enabled
    ? [
        'router-usage-events',
        options?.keyId ?? 'all',
        options?.limit ?? 100,
        options?.maxPages ?? 10,
        options?.start ?? '',
        options?.end ?? '',
        options?.effectiveModel ?? '',
      ]
    : null
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () =>
      fetchAllRouterUsageEvents({
        key_id: options?.keyId,
        limit: options?.limit,
        maxPages: options?.maxPages,
        start: options?.start,
        end: options?.end,
        effective_model: options?.effectiveModel,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 15000,
      keepPreviousData: true,
    }
  )

  return {
    events: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useRouterBillingLedger(options?: { keyId?: number; limit?: number; offset?: number; type?: number }) {
  const limit = options?.limit ?? 10
  const offset = options?.offset ?? 0
  const cacheKey = [
    'router-billing-ledger',
    options?.keyId ?? 'all',
    limit,
    offset,
    options?.type ?? 'all',
  ]
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () =>
      fetchRouterBillingLedger({
        key_id: options?.keyId,
        limit,
        offset,
        type: options?.type,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 15000,
    }
  )

  return {
    items: data?.data.items ?? [],
    total: data?.data.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useVoucherRedemptions(options?: { limit?: number; offset?: number }) {
  const limit = options?.limit ?? 10
  const offset = options?.offset ?? 0
  const cacheKey = ['router-voucher-redemptions', limit, offset]
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () =>
      fetchVoucherRedemptions({
        limit,
        offset,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  return {
    items: data?.data.items ?? [],
    total: data?.data.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  }
}

export interface UsageLogsFilter {
  page?: number
  pageSize?: number
  keyId?: number
  start?: string
  end?: string
  effectiveModel?: string
}

export function useRouterUsageLogs(filter: UsageLogsFilter) {
  const pageSize = filter.pageSize ?? 20
  const offset = ((filter.page ?? 1) - 1) * pageSize
  const cacheKey = [
    'router-usage-logs',
    filter.page ?? 1,
    pageSize,
    filter.keyId ?? 'all',
    filter.start ?? '',
    filter.end ?? '',
    filter.effectiveModel ?? '',
  ]
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () =>
      fetchRouterUsageEvents({
        limit: pageSize,
        offset,
        key_id: filter.keyId,
        start: filter.start,
        end: filter.end,
        effective_model: filter.effectiveModel,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      keepPreviousData: true,
    }
  )

  return {
    items: data?.data.items ?? [],
    total: data?.data.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  }
}
