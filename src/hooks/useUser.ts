/**
 * 用户信息 SWR Hook
 * 用于获取和管理用户信息缓存
 * SWR 作为唯一数据源，避免重复调用 /auth/me
 */

import useSWR from 'swr'
import { http } from '@/lib/api'
import { UserInfo } from '@/lib/api/auth'
import { useAuthStore } from '@/stores/auth'

interface UserInfoResponse {
  code: number
  message: string
  data: UserInfo
}

const fetcher = (url: string) => http.get<UserInfoResponse>(url)

export function useUser() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  const { data, error, isLoading, mutate } = useSWR<UserInfoResponse>(
    // 未登录时不发请求（isAuthenticated 为 false 时 key 为 null）
    isAuthenticated ? '/auth/me' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      shouldRetryOnError: false,
    }
  )

  return {
    user: data?.data ?? null,
    isLoading,
    isError: error,
    mutate,
  }
}
