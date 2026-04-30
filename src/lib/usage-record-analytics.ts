import type {
  RouterUsageAnalytics,
  RouterUsageAnalyticsOverview,
  RouterUsageAnalyticsRange,
  RouterUsageEvent,
  RouterUsageStat,
} from '@/lib/api/router'
import { formatShanghaiDateTimeLocalInput, toShanghaiApiDateTime } from '@/lib/time'

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

export interface UsageRecordAnalyticsWindow {
  start: string
  end: string
  granularity: 'hour' | 'day'
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

function truncateToHour(date: Date) {
  const next = new Date(date)
  next.setMinutes(0, 0, 0)
  return next
}

function truncateToDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
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

function isUsageEventSuccess(status: number) {
  return status === 1 || status === 200
}

function addGranularity(date: Date, granularity: UsageRecordAnalyticsWindow['granularity']) {
  return granularity === 'hour' ? addHours(date, 1) : addDays(date, 1)
}

function toAnalyticsBucketStart(value: Date, granularity: UsageRecordAnalyticsWindow['granularity']) {
  return granularity === 'hour' ? truncateToHour(value) : truncateToDay(value)
}

function formatAnalyticsBucketLabel(value: Date, granularity: UsageRecordAnalyticsWindow['granularity']) {
  if (granularity === 'hour') {
    return `${pad2(value.getHours())}:00`
  }

  return `${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`
}

function buildUsageRecordOverviewFromStats(stats: RouterUsageStat[]): RouterUsageAnalyticsOverview {
  return stats.reduce<RouterUsageAnalyticsOverview>(
    (overview, item) => {
      overview.total_requests += item.request_count
      overview.success_requests += item.success_count
      overview.total_cost += item.total_cost
      overview.success_rate = overview.total_requests > 0 ? overview.success_requests / overview.total_requests : 0
      return overview
    },
    {
      total_requests: 0,
      success_requests: 0,
      success_rate: 0,
      total_cost: 0,
    }
  )
}

function buildUsageRecordOverviewFromEvents(events: RouterUsageEvent[]): RouterUsageAnalyticsOverview {
  return events.reduce<RouterUsageAnalyticsOverview>(
    (overview, item) => {
      overview.total_requests += 1
      overview.success_requests += isUsageEventSuccess(item.status) ? 1 : 0
      overview.total_cost += item.cost
      overview.success_rate = overview.total_requests > 0 ? overview.success_requests / overview.total_requests : 0
      return overview
    },
    {
      total_requests: 0,
      success_requests: 0,
      success_rate: 0,
      total_cost: 0,
    }
  )
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
    start: toShanghaiApiDateTime(startDate) ?? '',
    end: toShanghaiApiDateTime(endDate) ?? '',
    startInput: formatShanghaiDateTimeLocalInput(startDate),
    endInput: formatShanghaiDateTimeLocalInput(endDate),
  }
}

export function buildUsageRecordAnalyticsWindow(
  range: RouterUsageAnalyticsRange,
  now: Date = new Date()
): UsageRecordAnalyticsWindow {
  switch (range) {
    case '8h': {
      const endDate = addHours(truncateToHour(now), 1)
      const startDate = addHours(endDate, -8)
      return { start: toShanghaiApiDateTime(startDate) ?? '', end: toShanghaiApiDateTime(endDate) ?? '', granularity: 'hour' }
    }
    case '24h': {
      const endDate = addHours(truncateToHour(now), 1)
      const startDate = addHours(endDate, -24)
      return { start: toShanghaiApiDateTime(startDate) ?? '', end: toShanghaiApiDateTime(endDate) ?? '', granularity: 'hour' }
    }
    case '7d': {
      const endDate = addDays(truncateToDay(now), 1)
      const startDate = addDays(endDate, -7)
      return { start: toShanghaiApiDateTime(startDate) ?? '', end: toShanghaiApiDateTime(endDate) ?? '', granularity: 'day' }
    }
    case '30d': {
      const endDate = addDays(truncateToDay(now), 1)
      const startDate = addDays(endDate, -30)
      return { start: toShanghaiApiDateTime(startDate) ?? '', end: toShanghaiApiDateTime(endDate) ?? '', granularity: 'day' }
    }
    default: {
      const endDate = addHours(truncateToHour(now), 1)
      const startDate = addHours(endDate, -8)
      return { start: toShanghaiApiDateTime(startDate) ?? '', end: toShanghaiApiDateTime(endDate) ?? '', granularity: 'hour' }
    }
  }
}

export function toUsageRecordQueryValue(value: string | undefined) {
  if (!value) {
    return undefined
  }

  return toShanghaiApiDateTime(value)
}

export function resolveUsageEventEffectiveModel(event: Pick<RouterUsageEvent, 'effective_model'>) {
  return event.effective_model || '-'
}

export function normalizeSuccessRateToPercent(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 0
  }
  return value <= 1 ? value * 100 : value
}

export function buildUsageRecordFallbackOverview(
  stats: RouterUsageStat[] = [],
  events: RouterUsageEvent[] = []
): RouterUsageAnalyticsOverview {
  const statsOverview = buildUsageRecordOverviewFromStats(stats)
  if (statsOverview.total_requests > 0 || statsOverview.total_cost > 0) {
    return statsOverview
  }

  return buildUsageRecordOverviewFromEvents(events)
}

export function buildUsageRecordFallbackAnalytics(options: {
  range: RouterUsageAnalyticsRange
  stats?: RouterUsageStat[]
  events?: RouterUsageEvent[]
  now?: Date
  currency?: string
}): RouterUsageAnalytics {
  const rangeWindow = buildUsageRecordAnalyticsWindow(options.range, options.now)
  const startDate = new Date(rangeWindow.start)
  const endDate = new Date(rangeWindow.end)
  const bucketStarts: Date[] = []
  const bucketCosts = new Map<string, Map<string, number>>()
  const modelStats = new Map<string, { requestCount: number; totalCost: number }>()

  for (let bucketStart = new Date(startDate); bucketStart < endDate; bucketStart = addGranularity(bucketStart, rangeWindow.granularity)) {
    bucketStarts.push(new Date(bucketStart))
    bucketCosts.set(bucketStart.toISOString(), new Map())
  }

  const overview = buildUsageRecordFallbackOverview(options.stats ?? [], options.events ?? [])

  for (const event of options.events ?? []) {
    const createdAt = new Date(event.created_at)
    if (Number.isNaN(createdAt.getTime())) {
      continue
    }

    const effectiveModel = resolveUsageEventEffectiveModel(event)
    const bucketStart = toAnalyticsBucketStart(createdAt, rangeWindow.granularity)
    const bucketKey = bucketStart.toISOString()
    const costs = bucketCosts.get(bucketKey)
    const currentModel = modelStats.get(effectiveModel) ?? { requestCount: 0, totalCost: 0 }

    currentModel.requestCount += 1
    currentModel.totalCost += event.cost
    modelStats.set(effectiveModel, currentModel)

    if (costs) {
      costs.set(effectiveModel, (costs.get(effectiveModel) ?? 0) + event.cost)
    }
  }

  const models = Array.from(modelStats.entries())
    .sort((left, right) => {
      if (right[1].requestCount !== left[1].requestCount) {
        return right[1].requestCount - left[1].requestCount
      }
      if (right[1].totalCost !== left[1].totalCost) {
        return right[1].totalCost - left[1].totalCost
      }
      return left[0].localeCompare(right[0])
    })
    .map(([effectiveModel, stats]) => ({
      effective_model: effectiveModel,
      request_count: stats.requestCount,
      request_share: overview.total_requests > 0 ? stats.requestCount / overview.total_requests : 0,
      total_cost: Number(stats.totalCost.toFixed(6)),
    }))

  return {
    range: options.range,
    granularity: rangeWindow.granularity,
    start: rangeWindow.start,
    end: rangeWindow.end,
    currency: options.currency ?? 'CNY',
    overview: {
      ...overview,
      total_cost: Number(overview.total_cost.toFixed(6)),
    },
    models,
    buckets: bucketStarts.map((bucketStart) => ({
      bucket_start: bucketStart.toISOString(),
      label: formatAnalyticsBucketLabel(bucketStart, rangeWindow.granularity),
      costs: Array.from(bucketCosts.get(bucketStart.toISOString())?.entries() ?? [])
        .sort((left, right) => {
          if (right[1] !== left[1]) {
            return right[1] - left[1]
          }
          return left[0].localeCompare(right[0])
        })
        .map(([effectiveModel, totalCost]) => ({
          effective_model: effectiveModel,
          total_cost: Number(totalCost.toFixed(6)),
        })),
    })),
  }
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
