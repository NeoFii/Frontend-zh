import useSWR from 'swr'
import { createRouterKey, deleteRouterKey, disableRouterKey, listRouterKeys, updateRouterKey } from '@/lib/api/router'
import type { ApiKeyCreatePayload, ApiKeyUpdatePayload } from '@/lib/api/router'

const ROUTER_KEYS_KEY = 'router-keys'

export function useRouterKeys() {
  const { data, error, isLoading, mutate } = useSWR(ROUTER_KEYS_KEY, listRouterKeys, {
    revalidateOnFocus: false,
    dedupingInterval: 15000,
  })

  return {
    keys: data?.data.items ?? [],
    isLoading,
    isError: error,
    mutate,
    async create(payload: ApiKeyCreatePayload) {
      const response = await createRouterKey(payload)
      await mutate()
      return response.data
    },
    async update(keyId: number, payload: ApiKeyUpdatePayload) {
      const response = await updateRouterKey(keyId, payload)
      await mutate()
      return response.data
    },
    async disable(keyId: number) {
      const response = await disableRouterKey(keyId)
      await mutate()
      return response.data
    },
    async remove(keyId: number) {
      const response = await deleteRouterKey(keyId)
      await mutate()
      return response.data
    },
  }
}
