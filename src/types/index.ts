// Unified type exports

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface ListResponse<T> extends ApiResponse<T[]> {
  total: number
  page?: number
  page_size?: number
}

export interface NewsListParams {
  page?: number
  page_size?: number
  category?: string
}

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

export interface NavItem {
  name: string
  path: string
  children?: NavItem[]
  external?: boolean
}

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

export type {
  LoginParams,
  RegisterParams,
  User,
  UserInfo,
  AuthSessionData,
  LoginResponse,
  RegisterResponse,
  SendCodeResponse,
  LogoutResponse,
  UserInfoResponse,
} from '@/lib/api/auth'

export type {
  ApiKey,
  UsageStats,
  PlatformData,
} from '@/lib/api/platform'

export type {
  RouterApiKey,
  RouterBillingLedgerItem,
  RouterUsageEvent,
  RouterUsageSummary,
} from '@/lib/api/router'

export type {
  ModelVendor,
  ModelVendorBrief,
  ModelCategory,
  ModelCategoryBrief,
  Provider,
  OfferingMetrics,
  ModelOffering,
  ModelListItem,
  ModelDetail,
  PagedResponse,
} from '@/types/model'
