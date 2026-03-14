// Testing 模块类型定义
// 与后端 testing/schemas.py 严格对应

// ========== 研发商（model_vendors）==========

/** 研发商：创造模型的公司（Anthropic / OpenAI / DeepSeek）*/
export interface ModelVendor {
  id: number
  slug: string
  name: string
  logo_url?: string
  is_active: boolean
}

/** 研发商简要信息（嵌入模型响应）*/
export interface ModelVendorBrief {
  id: number
  slug: string
  name: string
  logo_url?: string
}

// ========== 分类（model_categories）==========

/** 模型能力分类 */
export interface ModelCategory {
  id: number
  /** 分类键，如 reasoning / coding / tool_use / instruction_following */
  key: string
  name: string
  sort_order: number
  is_active: boolean
}

/** 分类简要信息（嵌入模型响应，sort_order 来自 model_category_map）*/
export interface ModelCategoryBrief {
  key: string
  name: string
  /** 该模型在此分类下的排序权重（来自 model_category_map.sort_order）*/
  sort_order: number
}

// ========== 服务提供商（providers）==========

/** API 服务提供商：提供模型访问渠道的公司（OpenRouter / Azure / 直连）*/
export interface Provider {
  id: number
  slug: string
  name: string
  logo_url?: string
  is_active: boolean
}

// ========== 性能指标（聚合自 provider_metrics_ranked 视图）==========

/** 单个报价的近 N 次成功探测均值 */
export interface OfferingMetrics {
  probe_region?: string
  avg_throughput_tps?: number
  avg_ttft_ms?: number
  avg_e2e_latency_ms?: number
  sample_count: number
  last_measured_at?: string
}

// ========== 模型-提供商报价（model_provider_offerings）==========

/** 模型在某提供商的报价配置（含性能指标）*/
export interface ModelOffering {
  id: number
  provider: { id: number; slug: string; name: string; logo_url?: string }
  /** 每百万输入 token 价格（人民币，null=未知）*/
  price_input_per_m?: number
  /** 每百万输出 token 价格（人民币，null=未知）*/
  price_output_per_m?: number
  price_updated_at?: string
  is_active: boolean
  metrics?: OfferingMetrics
}

// ========== 模型（models）==========

/** 模型列表项（用于分类页卡片） */
export interface ModelListItem {
  id: number
  slug: string
  name: string
  description?: string
  /** 能力标签，如 ["chat","reasoning","vision","tool_calling"] */
  capability_tags: string[]
  context_window?: number
  max_output_tokens?: number
  is_reasoning_model: boolean
  sort_order: number
  vendor: ModelVendorBrief
  categories: ModelCategoryBrief[]
}

/** 模型详情（用于详情页，附带所有报价和性能指标）*/
export interface ModelDetail extends ModelListItem {
  is_active: boolean
  offerings: ModelOffering[]
}

// ========== 通用类型 ==========

export interface PagedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

// ========== 基准测试摘要（聚合自 provider_metrics_ranked 视图）==========

/** 单个报价的近 N 次探测均值（用于基准测试摘要页） */
export interface BenchmarkOfferingSummary {
  offering_id: number
  provider_name: string
  provider_slug: string
  metrics: {
    avg_throughput_tps?: number
    avg_ttft_ms?: number
    avg_e2e_latency_ms?: number
    sample_count: number
    last_measured_at?: string
  } | null
}

/** 模型级别的基准测试汇总（包含所有提供商的报价性能） */
export interface BenchmarkModelSummary {
  model_slug: string
  model_name: string
  vendor_name: string
  offerings: BenchmarkOfferingSummary[]
}

// ========== 性能趋势（多日时间序列）==========

/** 单个时间点的性能数据（按天聚合） */
export interface TrendDataPoint {
  date: string
  avg_throughput_tps?: number
  avg_ttft_ms?: number
  avg_e2e_latency_ms?: number
  sample_count: number
}

/** 单个提供商的趋势线数据 */
export interface ProviderTrendLine {
  provider_id: number
  provider_name: string
  provider_slug: string
  provider_logo_url?: string
  data_points: TrendDataPoint[]
  min_throughput?: number
  max_throughput?: number
  avg_throughput?: number
  min_ttft?: number
  max_ttft?: number
  avg_ttft?: number
}

/** 模型性能趋势响应 */
export interface BenchmarkTrendResponse {
  model_slug: string
  model_name: string
  days: number
  date_range: string
  providers: ProviderTrendLine[]
}
