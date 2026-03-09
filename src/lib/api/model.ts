// Testing 模块 API 封装

import apiClient from './index'
import type {
  Category,
  CategoryCreate,
  ModelListItem,
  ModelDetail,
  ModelCreate,
  Provider,
  ProviderCreate,
  ModelProviderInfo,
  BenchmarkStats,
  BenchmarkStatsSummaryItem,
  BenchmarkRunRequest,
  BenchmarkRunResponse,
  PagedResponse,
} from '@/types/model'

// Testing 服务通过 Next.js rewrite 代理转发，避免浏览器跨域问题
// 代理规则: /testing-api/* → TESTING_API_URL/api/*（配置在 next.config.mjs）
const TESTING_API_PREFIX = '/testing-api'

// 使用独立客户端调用 Testing 服务（通过 rewrite 代理）
const testingClient = {
  get: <T>(url: string, config?: Parameters<typeof apiClient.get>[1]) =>
    apiClient.get<T, T>(`${TESTING_API_PREFIX}${url}`, config),

  post: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof apiClient.post>[2]
  ) => apiClient.post<T, T>(`${TESTING_API_PREFIX}${url}`, data, config),

  put: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof apiClient.put>[2]
  ) => apiClient.put<T, T>(`${TESTING_API_PREFIX}${url}`, data, config),

  delete: <T>(url: string, config?: Parameters<typeof apiClient.delete>[1]) =>
    apiClient.delete<T, T>(`${TESTING_API_PREFIX}${url}`, config),
}

// ========== 分类 API ==========

/**
 * 获取分类列表
 */
export async function getCategories(): Promise<Category[]> {
  const response = await testingClient.get<PagedResponse<Category>>('/v1/models/categories')
  return response.items
}

/**
 * 根据 slug 获取分类详情
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  const response = await testingClient.get<PagedResponse<Category>>(
    `/v1/models/categories/${slug}`
  )
  return response.items[0]
}

/**
 * 创建分类
 */
export async function createCategory(data: CategoryCreate): Promise<Category> {
  return testingClient.post<Category>('/v1/models/categories', data)
}

// ========== 模型 API ==========

/**
 * 获取模型列表
 */
export async function getModels(params?: {
  category?: string
  page?: number
  page_size?: number
}): Promise<PagedResponse<ModelListItem>> {
  const searchParams = new URLSearchParams()
  if (params?.category) searchParams.set('category', params.category)
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.page_size) searchParams.set('page_size', String(params.page_size))

  const queryString = searchParams.toString()
  const url = queryString ? `/v1/models?${queryString}` : '/v1/models'

  return testingClient.get<PagedResponse<ModelListItem>>(url)
}

/**
 * 获取模型详情
 */
export async function getModelById(modelId: string): Promise<ModelDetail> {
  return testingClient.get<ModelDetail>(`/v1/models/${modelId}`)
}

/**
 * 创建模型
 */
export async function createModel(data: ModelCreate): Promise<ModelDetail> {
  return testingClient.post<ModelDetail>('/v1/models', data)
}

/**
 * 获取模型的供应商列表
 */
export async function getModelProviders(
  modelId: string
): Promise<{ items: ModelProviderInfo[] }> {
  return testingClient.get<{ items: ModelProviderInfo[] }>(
    `/v1/models/${modelId}/providers`
  )
}

// ========== 供应商 API ==========

/**
 * 获取供应商列表
 */
export async function getProviders(): Promise<Provider[]> {
  const response = await testingClient.get<PagedResponse<Provider>>('/v1/providers')
  return response.items
}

/**
 * 获取供应商详情
 */
export async function getProviderById(providerId: string): Promise<Provider> {
  return testingClient.get<Provider>(`/v1/providers/${providerId}`)
}

/**
 * 创建供应商
 */
export async function createProvider(data: ProviderCreate): Promise<Provider> {
  return testingClient.post<Provider>('/v1/providers', data)
}

// ========== 性能测试 API ==========

/**
 * 获取所有模型供应商性能统计汇总
 */
export async function getBenchmarkStatsSummary(
  hours?: number
): Promise<BenchmarkStatsSummaryItem[]> {
  const url = hours
    ? `/v1/benchmark/stats/summary?hours=${hours}`
    : '/v1/benchmark/stats/summary'
  const response = await testingClient.get<{ items: BenchmarkStatsSummaryItem[] }>(url)
  return response.items
}

/**
 * 获取单个模型供应商的性能统计
 */
export async function getBenchmarkStats(
  modelProviderId: number,
  hours?: number
): Promise<BenchmarkStats> {
  const url = hours
    ? `/v1/benchmark/stats/${modelProviderId}?hours=${hours}`
    : `/v1/benchmark/stats/${modelProviderId}`
  return testingClient.get<BenchmarkStats>(url)
}

/**
 * 触发性能测试
 */
export async function runBenchmark(
  data: BenchmarkRunRequest
): Promise<BenchmarkRunResponse> {
  return testingClient.post<BenchmarkRunResponse>('/v1/benchmark/run', data)
}
