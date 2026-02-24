/**
 * 用户信息 SWR Hook
 * 用于获取和管理用户信息缓存
 */

import useSWR from 'swr'
import { http } from '@/lib/api'
import type { UserInfo } from '@/types'

interface UserInfoResponse {
  code: number
  message: string
  data: UserInfo
}

const fetcher = (url: string) => http.get<UserInfoResponse>(url)

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<UserInfoResponse>(
    '/auth/me',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      shouldRetryOnError: false,
    }
  )

  return {
    user: data?.data,
    isLoading,
    isError: error,
    mutate,
  }
}
