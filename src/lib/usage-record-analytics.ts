import type { RouterUsageAnalytics, RouterUsageAnalyticsRange, RouterUsageEvent } from '@/lib/api/router'

const MODEL_COLOR_PALETTE = ['#0f172a', '#2563eb', '#ea580c', '#059669', '#7c3aed', '#dc2626', '#0891b2', '#ca8a04']
const OTHER_MODEL_LABEL = '其他'
const OTHER_MODEL_COLOR = '#94a3b8'
const TOP_MODEL_LIMIT = 8

export const USAGE_RECORD_RANGES: RouterUsageAnalyticsRange[] = ['8h', '24h', '7d', '30d']

export interface UsageRecordTimeWindow {
  start: string
  end: string
  startInput: string
  endInput: string
}

export interface UsageRecordModelBreakdown {
  model: string
  requestCount: number
  requestSharePercent: number
  totalCost: number
  color: string
}

export interface UsageRecordStackedSeries {
  model: string
  color: string
  data: number[]
}

export interface UsageRecordAnalyticsViewModel {
  models: UsageRecordModelBreakdown[]
  donut: UsageRecordModelBreakdown[]
  ranking: UsageRecordModelBreakdown[]
  stackedBar: {
    labels: string[]
    series: UsageRecordStackedSeries[]
  }
  colorMap: Record<string, string>
  hasData: boolean
}

function truncateToMinute(date: Date) {
  const next = new Date(date)
  next.setSeconds(0, 0)
  return next
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

function pad2(value: number) {
  return String(value).padStart(2, '0')
}

function formatDateTimeLocalInput(date: Date) {
  return [
    date.getFullYear(),
    '-',
    pad2(date.getMonth() + 1),
    '-',
    pad2(date.getDate()),
    'T',
    pad2(date.getHours()),
    ':',
    pad2(date.getMinutes()),
  ].join('')
}

function sumCostByModel(
  costs: RouterUsageAnalytics['buckets'][number]['costs'],
  selectedModel: string,
  topModels: Set<string>
) {
  return costs.reduce((total, item) => {
    if (selectedModel === OTHER_MODEL_LABEL) {
      return topModels.has(item.effective_model) ? total : total + item.total_cost
    }
    return item.effective_model === selectedModel ? total + item.total_cost : total
  }, 0)
}

export function buildUsageRecordTimeWindow(
  range: RouterUsageAnalyticsRange,
  now: Date = new Date()
): UsageRecordTimeWindow {
  const endDate = truncateToMinute(now)
  const startDate = (() => {
    switch (range) {
      case '8h':
        return addHours(endDate, -8)
      case '24h':
        return addHours(endDate, -24)
      case '7d':
        return addDays(endDate, -7)
      case '30d':
        return addDays(endDate, -30)
      default:
        return addHours(endDate, -8)
    }
  })()

  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    startInput: formatDateTimeLocalInput(startDate),
    endInput: formatDateTimeLocalInput(endDate),
  }
}

export function toUsageRecordQueryValue(value: string | undefined) {
  if (!value) {
    return undefined
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed.toISOString()
}

export function resolveUsageEventEffectiveModel(event: Pick<RouterUsageEvent, 'selected_model' | 'model_name'>) {
  return event.selected_model || event.model_name || '-'
}

export function normalizeSuccessRateToPercent(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 0
  }
  return value <= 1 ? value * 100 : value
}

export function buildUsageRecordAnalyticsViewModel(
  analytics: RouterUsageAnalytics | null
): UsageRecordAnalyticsViewModel {
  const rawModels = [...(analytics?.models ?? [])].sort((left, right) => {
    if (right.request_count !== left.request_count) {
      return right.request_count - left.request_count
    }
    return right.total_cost - left.total_cost
  })

  const topModels = rawModels.slice(0, TOP_MODEL_LIMIT)
  const tailModels = rawModels.slice(TOP_MODEL_LIMIT)
  const totalRequests = analytics?.overview.total_requests ?? rawModels.reduce((sum, item) => sum + item.request_count, 0)

  const groupedModels = topModels.map((item) => ({
    model: item.effective_model,
    requestCount: item.request_count,
    requestSharePercent: totalRequests > 0 ? (item.request_count / totalRequests) * 100 : 0,
    totalCost: item.total_cost,
  }))

  if (tailModels.length > 0) {
    const tailRequestCount = tailModels.reduce((sum, item) => sum + item.request_count, 0)
    const tailTotalCost = tailModels.reduce((sum, item) => sum + item.total_cost, 0)
    groupedModels.push({
      model: OTHER_MODEL_LABEL,
      requestCount: tailRequestCount,
      requestSharePercent: totalRequests > 0 ? (tailRequestCount / totalRequests) * 100 : 0,
      totalCost: tailTotalCost,
    })
  }

  const colorMap = groupedModels.reduce<Record<string, string>>((map, item, index) => {
    map[item.model] = item.model === OTHER_MODEL_LABEL
      ? OTHER_MODEL_COLOR
      : MODEL_COLOR_PALETTE[index % MODEL_COLOR_PALETTE.length]
    return map
  }, {})

  const models = groupedModels.map((item) => ({
    ...item,
    color: colorMap[item.model],
  }))

  const topModelSet = new Set(topModels.map((item) => item.effective_model))
  const labels = analytics?.buckets.map((bucket) => bucket.label) ?? []
  const series = models.map((item) => ({
    model: item.model,
    color: item.color,
    data: (analytics?.buckets ?? []).map((bucket) =>
      Number(sumCostByModel(bucket.costs, item.model, topModelSet).toFixed(6))
    ),
  }))

  return {
    models,
    donut: models,
    ranking: models,
    stackedBar: {
      labels,
      series,
    },
    colorMap,
    hasData:
      (analytics?.overview.total_requests ?? 0) > 0 ||
      models.some((item) => item.requestCount > 0 || item.totalCost > 0) ||
      series.some((item) => item.data.some((value) => value > 0)),
  }
}
