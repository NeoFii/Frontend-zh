import useSWR from 'swr'
import { createRouterKey, deleteRouterKey, listRouterKeys, revealRouterKey, updateRouterKey } from '@/lib/api/router'

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
    async create(name: string) {
      const response = await createRouterKey(name)
      await mutate()
      return response.data
    },
    async update(keyId: number, payload: { name?: string; is_active?: boolean }) {
      const response = await updateRouterKey(keyId, payload)
      await mutate()
      return response.data
    },
    async reveal(keyId: number) {
      const response = await revealRouterKey(keyId)
      return response.data
    },
    async remove(keyId: number) {
      const response = await deleteRouterKey(keyId)
      await mutate()
      return response.data
    },
  }
}
