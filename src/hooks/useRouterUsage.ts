import useSWR from 'swr'
import {
  fetchAllRouterUsageEvents,
  fetchRouterBillingLedger,
  fetchRouterUsageSummary,
} from '@/lib/api/router'

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

export function useRouterUsageEvents(options?: { keyId?: number; limit?: number; maxPages?: number }) {
  const cacheKey = ['router-usage-events', options?.keyId ?? 'all', options?.limit ?? 200, options?.maxPages ?? 10]
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () =>
      fetchAllRouterUsageEvents({
        key_id: options?.keyId,
        limit: options?.limit,
        maxPages: options?.maxPages,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 15000,
    }
  )

  return {
    events: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useRouterBillingLedger(options?: { keyId?: number; limit?: number; offset?: number }) {
  const cacheKey = ['router-billing-ledger', options?.keyId ?? 'all', options?.limit ?? 50, options?.offset ?? 0]
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () =>
      fetchRouterBillingLedger({
        key_id: options?.keyId,
        limit: options?.limit,
        offset: options?.offset,
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
