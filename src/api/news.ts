import { http } from './index'
import type {
  ApiResponse,
  NewsItem,
  NewsListResponse,
  NewsListParams
} from '@/types'

// 获取新闻列表
export function fetchNewsList(params?: NewsListParams): Promise<NewsListResponse> {
  return http.get('/news', { params })
}

// 获取新闻分类
export function fetchNewsCategories(): Promise<ApiResponse<string[]>> {
  return http.get('/news/categories')
}

// 获取新闻详情
export function fetchNewsDetail(id: number): Promise<ApiResponse<NewsItem>> {
  return http.get(`/news/${id}`)
}
