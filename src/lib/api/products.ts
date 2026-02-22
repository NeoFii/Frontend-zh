import { http } from './index'
import type { ApiResponse, ListResponse, ProductItem } from '@/types'

// 产品列表响应类型
export type ProductListResponse = ListResponse<ProductItem>

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
