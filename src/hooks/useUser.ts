/**
 * 用户信息 SWR Hook
 * 用于获取和管理用户信息缓存
 * SWR 作为唯一数据源，避免重复调用 /auth/me
 */

import { useEffect } from 'react'
import useSWR from 'swr'
import { getCurrentUser, refreshSession, type UserInfoResponse } from '@/lib/api/auth'
import { useAuthStore } from '@/stores/auth'

interface UseUserOptions {
  enabled?: boolean
  restoreSession?: boolean
}

type ErrorWithStatus = {
  response?: {
    status?: number
  }
}

export function getResponseStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined
  }

  return Number((error as ErrorWithStatus).response?.status)
}

export async function fetchCurrentUser(restoreSession = false): Promise<UserInfoResponse> {
  try {
    return await getCurrentUser()
  } catch (error) {
    if (!restoreSession || getResponseStatus(error) !== 401) {
      throw error
    }

    await refreshSession()
    return getCurrentUser()
  }
}

export function useUser(options: UseUserOptions = {}) {
  const enabled = options.enabled ?? true
  const restoreSession = options.restoreSession ?? false
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const setSession = useAuthStore((state) => state.setSession)
  const setUser = useAuthStore((state) => state.setUser)

  const { data, error, isLoading, mutate } = useSWR<UserInfoResponse>(
    // 未登录时不发请求（isAuthenticated 为 false 时 key 为 null）
    enabled && isHydrated ? '/auth/me' : null,
    () => fetchCurrentUser(restoreSession),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      shouldRetryOnError: false,
    }
  )

  useEffect(() => {
    if (!enabled || !isHydrated) {
      return
    }

    if (data?.data) {
      setSession('authenticated', data.data)
      return
    }

    if (error) {
      const status = getResponseStatus(error)

      if (status === 401 || status === 403) {
        setSession('anonymous', null)
      } else {
        setUser(null)
      }
    }
  }, [data, enabled, error, isHydrated, setSession, setUser])

  return {
    user: data?.data ?? null,
    isLoading,
    isError: error,
    mutate,
  }
}
