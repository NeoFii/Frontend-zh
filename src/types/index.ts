// 通用响应类型
export interface ApiResponse<T = unknown> {
  code: string
  message: string
  data: T
}

// 列表响应类型
export interface ListResponse<T> extends ApiResponse<T[]> {
  total: number
  page?: number
  page_size?: number
}

// 新闻相关类型
export interface NewsItem {
  id: number
  title: string
  summary?: string
  content?: string
  cover_image?: string
  author?: string
  category?: string
  is_published?: boolean
  created_at: string
  updated_at?: string
  view_count?: number
}

export interface NewsListParams {
  page?: number
  page_size?: number
  category?: string
}

export interface NewsListResponse extends ListResponse<NewsItem> {}

// 产品相关类型
export interface ProductItem {
  id: number
  name: string
  short_description?: string
  full_description?: string
  image?: string
  icon?: string
  features?: string[]
  category?: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface ProductListResponse extends ApiResponse<ProductItem[]> {}

// 联系表单类型
export interface ContactForm {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
}

export interface ContactFormResponse extends ApiResponse<Record<string, unknown>> {
  data: {
    email_sent: boolean
    name: string
    subject: string
  }
}

export interface ContactInfo {
  company_name: string
  address?: string
  phone?: string
  email?: string
  business_hours?: string
  social_media?: {
    wechat?: string
    weibo?: string
    linkedin?: string
  }
}

// 导航类型
export interface NavItem {
  name: string
  path: string
  children?: NavItem[]
}

