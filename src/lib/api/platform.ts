import { http } from './index'
import type { ApiResponse } from '@/types'

export interface ApiKey {
  id: number
  name: string
  key: string
  created_at: string
  last_used?: string
  status: 'active' | 'inactive'
}

export interface UsageStats {
  date: string
  requests: number
  tokens: number
  cost: number
}

export interface PlatformData {
  apiKeys: ApiKey[]
  usageStats: UsageStats[]
  totalRequests: number
  totalTokens: number
  totalCost: number
}

/**
 * 获取平台数据概览
 */
export function fetchPlatformData(): Promise<ApiResponse<PlatformData>> {
  return http.get('/platform/dashboard')
}

/**
 * 获取用户统计数据
 */
export function fetchUserStats(): Promise<ApiResponse<UsageStats[]>> {
  return http.get('/platform/stats')
}

/**
 * 获取 API 密钥列表
 */
export function fetchApiKeys(): Promise<ApiResponse<ApiKey[]>> {
  return http.get('/platform/api-keys')
}

/**
 * 创建新的 API 密钥
 */
export function createApiKey(name: string): Promise<ApiResponse<ApiKey>> {
  return http.post('/platform/api-keys', { name })
}

/**
 * 删除 API 密钥
 */
export function deleteApiKey(id: number): Promise<ApiResponse<void>> {
  return http.delete(`/platform/api-keys/${id}`)
}

/**
 * 获取使用详情
 */
export function fetchUsageDetails(startDate: string, endDate: string): Promise<ApiResponse<UsageStats[]>> {
  return http.get('/platform/usage', {
    params: { start_date: startDate, end_date: endDate }
  })
}
