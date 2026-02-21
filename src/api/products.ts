import { http } from './index'
import type {
  ApiResponse,
  ProductItem,
  ProductListResponse
} from '@/types'

// 获取产品列表
export function fetchProductList(category?: string): Promise<ProductListResponse> {
  return http.get('/products', { params: { category } })
}

// 获取产品分类
export function fetchProductCategories(): Promise<ApiResponse<string[]>> {
  return http.get('/products/categories')
}

// 获取产品详情
export function fetchProductDetail(id: number): Promise<ApiResponse<ProductItem>> {
  return http.get(`/products/${id}`)
}
