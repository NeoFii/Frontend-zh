/**
 * CMS 内容管理系统类型定义
 * 用于 Markdown 文件的内容管理
 */

// 产品特性
export interface ProductHighlight {
  id: string
  title: string
  description: string
  icon: string
}

// 产品使用场景
export interface UseCase {
  id: string
  title: string
  description: string
  benefits: string[]
  image: string
}

// 产品统计数据
export interface ProductStat {
  label: string
  value: string
  suffix: string
}

// 价格方案
export interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  isRecommended: boolean
}

// 产品定价信息
export interface ProductPricing {
  description: string
  contactSales: boolean
  plans: PricingPlan[]
}

// FAQ 条目
export interface FAQItem {
  id: string
  question: string
  answer: string
}

// 客户评价
export interface Testimonial {
  id: string
  content: string
  author: string
  company: string
}

// 产品详情类型
export interface ProductItem {
  slug: string
  id: number
  name: string
  tagline: string
  shortDescription: string
  fullDescription: string
  description?: string
  image?: string
  icon?: string
  category?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  stats: ProductStat[]
  highlights: ProductHighlight[]
  useCases: UseCase[]
  pricing: ProductPricing
  faqs?: FAQItem[]
  testimonials?: Testimonial[]
  content: string
}

// Markdown frontmatter 元数据（产品）
export interface ProductFrontmatter {
  id: number
  name: string
  tagline: string
  shortDescription: string
  fullDescription: string
  icon?: string
  image?: string
  category?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  stats: ProductStat[]
  highlights: ProductHighlight[]
  useCases: UseCase[]
  pricing: ProductPricing
  faqs?: FAQItem[]
  testimonials?: Testimonial[]
}

// CMS 查询参数
export interface CMSQueryParams {
  limit?: number
  offset?: number
  category?: string
  sortBy?: 'date' | 'title' | 'sort_order'
  sortOrder?: 'asc' | 'desc'
  locale?: string
}

// CMS 查询结果
export interface CMSQueryResult<T> {
  items: T[]
  total: number
  hasMore: boolean
}
