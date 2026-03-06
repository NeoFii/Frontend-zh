// 统一类型导出

// 通用类型
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

// 新闻列表参数
export interface NewsListParams {
  page?: number
  page_size?: number
  category?: string
}

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

// 联系信息类型
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
  external?: boolean
}

// 从 CMS 类型重新导出
export type {
  ProductItem,
  ProductFrontmatter,
  CMSQueryParams,
  CMSQueryResult,
  Testimonial,
  FAQItem,
  ProductHighlight,
  UseCase,
  ProductStat,
  PricingPlan,
  ProductPricing,
} from './cms'

// 从 API 模块导出认证相关类型
export type {
  LoginParams,
  RegisterParams,
  User,
  UserInfo,
  LoginResponse,
  RegisterResponse,
  SendCodeResponse,
  LogoutResponse,
  UserInfoResponse,
} from '@/lib/api/auth'

// 从 API 模块导出平台相关类型
export type {
  ApiKey,
  UsageStats,
  PlatformData,
} from '@/lib/api/platform'
