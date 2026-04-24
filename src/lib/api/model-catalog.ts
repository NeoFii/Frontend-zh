import axios from 'axios'
import type {
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
import proxyConfig from '@/lib/proxy-config'

// TODO(v-next): 模型目录端点在 admin-service(:8001)，当前通过 /api/v1 代理到
// user-service(:8000)。合并部署模式下正常，分离部署会 404。
const MODEL_CATALOG_API_BASE = proxyConfig.resolveModelCatalogApiBaseUrl()

const catalogAxios = axios.create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

catalogAxios.interceptors.response.use((res) => res.data)

const catalogClient = {
  get: <T>(url: string, config?: Parameters<typeof catalogAxios.get>[1]) =>
    catalogAxios.get<T, T>(`${MODEL_CATALOG_API_BASE}${url}`, config),
}

export async function getVendors(): Promise<ModelVendor[]> {
  const response = await catalogClient.get<{ data: PagedResponse<ModelVendor> }>('/model-vendors')
  return response.data.items
}

export async function getCategories(): Promise<ModelCategory[]> {
  const response = await catalogClient.get<{ data: PagedResponse<ModelCategory> }>(
    '/models/categories'
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
  const url = queryString ? `/models?${queryString}` : '/models'

  const response = await catalogClient.get<{ data: PagedResponse<ModelListItem> }>(url)
  return {
    ...response.data,
    items: response.data.items.map((item) => normalizeModelListItem(item)),
  }
}

export async function getModelBySlug(slug: string, n: number = 5): Promise<ModelDetail> {
  const response = await catalogClient.get<{ data: ModelDetail }>(`/models/${slug}?n=${n}`)
  return normalizeModelDetail(response.data)
}
