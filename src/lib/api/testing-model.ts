import axios from 'axios'
import type {
  BenchmarkModelSummary,
  BenchmarkTrendResponse,
  ModelCategory,
  ModelDetail,
  ModelListItem,
  ModelVendor,
  PagedResponse,
} from '@/types/model'
import {
  DEFAULT_MODEL_CATEGORIES,
  normalizeModelCategories,
  normalizeModelDetail,
  normalizeModelListItem,
} from '@/lib/model-categories'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

const TESTING_API_BASE =
  process.env.NEXT_PUBLIC_TESTING_API_BASE_URL ||
  `${(process.env.NEXT_PUBLIC_TESTING_API_URL || 'http://localhost:8002').replace(/\/$/, '')}/api`

const testingAxios = axios.create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

testingAxios.interceptors.response.use((res) => res.data)

const EMPTY_BENCHMARK_TRENDS: BenchmarkTrendResponse = {
  model_slug: '',
  model_name: '',
  days: 7,
  date_range: '',
  providers: [],
}

const testingClient = {
  get: <T>(url: string, config?: Parameters<typeof testingAxios.get>[1]) =>
    testingAxios.get<T, T>(`${TESTING_API_BASE}${url}`, config),
}

function isProtectedBenchmarkError(error: unknown): boolean {
  return axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)
}

export async function getVendors(): Promise<ModelVendor[]> {
  const response = await testingClient.get<{ data: PagedResponse<ModelVendor> }>('/v1/vendors')
  return response.data.items
}

export async function getCategories(): Promise<ModelCategory[]> {
  const response = await testingClient.get<{ data: PagedResponse<ModelCategory> }>(
    '/v1/models/categories'
  )
  const categories = normalizeModelCategories(response.data.items)
  return categories.length > 0 ? categories : DEFAULT_MODEL_CATEGORIES
}

export async function getModels(params?: {
  category?: string
  vendors?: string[]
  q?: string
  page?: number
  page_size?: number
}): Promise<PagedResponse<ModelListItem>> {
  const searchParams = new URLSearchParams()
  if (params?.category) searchParams.set('category', params.category)
  if (params?.vendors?.length) searchParams.set('vendors', params.vendors.join(','))
  if (params?.q) searchParams.set('q', params.q)
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.page_size) searchParams.set('page_size', String(params.page_size))

  const queryString = searchParams.toString()
  const url = queryString ? `/v1/models/?${queryString}` : '/v1/models/'

  const response = await testingClient.get<{ data: PagedResponse<ModelListItem> }>(url)
  return {
    ...response.data,
    items: response.data.items.map((item) => normalizeModelListItem(item)),
  }
}

export async function getBenchmarkStatsSummary(n: number = 5): Promise<BenchmarkModelSummary[]> {
  try {
    const response = await testingClient.get<
      ApiResponse<{ items: BenchmarkModelSummary[]; total: number }>
    >(`/v1/benchmark/stats/summary?n=${n}`)
    return response.data.items
  } catch (error) {
    if (isProtectedBenchmarkError(error)) {
      return []
    }
    throw error
  }
}

export async function getModelBySlug(slug: string, n: number = 5): Promise<ModelDetail> {
  const response = await testingClient.get<{ data: ModelDetail }>(`/v1/models/${slug}?n=${n}`)
  return normalizeModelDetail(response.data)
}

export async function getBenchmarkTrends(
  modelSlug: string,
  days: number = 7
): Promise<BenchmarkTrendResponse> {
  try {
    const response = await testingClient.get<ApiResponse<BenchmarkTrendResponse>>(
      `/v1/benchmark/trends?model_slug=${encodeURIComponent(modelSlug)}&days=${days}`
    )
    return response.data
  } catch (error) {
    if (isProtectedBenchmarkError(error)) {
      return {
        ...EMPTY_BENCHMARK_TRENDS,
        model_slug: modelSlug,
        days,
      }
    }
    throw error
  }
}
