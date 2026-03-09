// Testing 模块类型定义

// ========== 分类 ==========

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  sort_order: number
  model_count?: number
}

export interface CategoryCreate {
  name: string
  slug: string
  description?: string
  icon?: string
  sort_order?: number
}

// ========== 模型 ==========

export interface ModelListItem {
  id: number
  model_id: string
  name: string
  description?: string
  context_length: number
  model_size?: string
  is_open_source: boolean
  tags: string[]
  category?: ModelCategoryInfo
  provider_count: number
}

export interface ModelDetail extends ModelListItem {
  is_active: boolean
  categories: ModelCategoryInfo[]
}

export interface ModelCategoryInfo {
  slug: string
  name: string
}

export interface ModelCreate {
  model_id: string
  name: string
  description?: string
  context_length: number
  model_size?: string
  is_open_source?: boolean
  is_active?: boolean
  category_ids: number[]
  tag_names: string[]
}

// ========== 供应商 ==========

export interface Provider {
  id: number
  provider_id: string
  name: string
  logo_url?: string
  color?: string
  is_active: boolean
  sort_order: number
  model_count?: number
}

export interface ProviderCreate {
  provider_id: string
  name: string
  logo_url?: string
  color?: string
  is_active?: boolean
  sort_order?: number
}

// ========== 模型供应商关联 ==========

export interface ModelProviderInfo {
  model_provider_id: number
  provider_id: string
  provider_name: string
  provider_name_zh?: string
  color?: string
  api_model_name: string
  routing_alias?: string
  input_price_cny_1m?: number
  output_price_cny_1m?: number
  rate_limit_rpm: number
  is_default: boolean
  stats?: BenchmarkStats
}

// ========== 性能测试 ==========

export interface BenchmarkStats {
  model_provider_id: number
  avg_latency_ttft?: number
  avg_latency_total?: number
  avg_throughput?: number
  success_rate?: number
  success_count: number
  fail_count: number
  test_count: number
  last_test_at?: string
}

export interface BenchmarkStatsSummaryItem {
  model_id: string
  model_name: string
  providers: Array<{
    model_provider_id: number
    provider_name: string
    stats: BenchmarkStats
  }>
}

export interface BenchmarkRunRequest {
  model_provider_ids?: number[]
  concurrency?: number
  timeout?: number
}

export interface BenchmarkRunResponse {
  task_id: string
  status: string
  total: number
  submitted: number
}

// ========== 通用类型 ==========

export interface PagedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}
