import type { RouterApiKey, RouterUsageEvent, RouterUsageStat, RouterUsageSummary } from '@/lib/api/router'
import { formatShanghaiDateTime, toShanghaiApiDateTime } from '@/lib/time'

export type UsageRange = '24h' | '7d' | '30d' | '90d'
export type BalanceTokenTrendRange = '24h' | '7d' | '30d'

export interface UsageAggregate {
  totalRequests: number
  successRequests: number
  totalTokens: number
  promptTokens: number
  completionTokens: number
  totalCost: number
  averageLatencyMs: number | null
  currency: string
}

export interface ModelUsageStat {
  model: string
  requests: number
  totalTokens: number
  totalCost: number
}

export interface UsageComparisonModelOption {
  id: string
  name: string
  color: string
}

export interface UsageComparisonData {
  actualCost: number
  theoreticalCost: number
  savedAmount: number
  savingsPercentage: number
  referenceModelName: string
  isSaving: boolean
}

export interface UsageDashboardViewModel {
  aggregate: UsageAggregate
  currency: string
  modelStats: ModelUsageStat[]
  dailyTrend: DailyTrendPoint[]
  comparison: UsageComparisonData
  successRate: number
  hasEvents: boolean
}

export interface DailyTrendPoint {
  date: string
  requests: number
  promptTokens: number
  completionTokens: number
  totalTokens: number
  totalCost: number
}

export interface BalanceTokenTrendPoint {
  bucketStart: string
  label: string
  promptTokens: number
  completionTokens: number
  cachedTokens: number
}

export interface BalanceTokenTrendViewModel {
  start: string
  end: string
  points: BalanceTokenTrendPoint[]
  xAxis: string[]
  legend: string[]
  series: Array<{ name: string; data: number[] }>
  hasData: boolean
}

function toDate(value: string): Date {
  return new Date(value)
}

function startOfHour(date: Date) {
  const next = new Date(date)
  next.setMinutes(0, 0, 0)
  return next
}

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function addHours(date: Date, hours: number) {
  const next = new Date(date)
  next.setHours(next.getHours() + hours)
  return next
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function pad2(value: number) {
  return String(value).padStart(2, '0')
}

function formatHourLabel(date: Date) {
  return `${pad2(date.getHours())}:00`
}

function formatMonthDayLabel(date: Date) {
  return `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function formatLocalDayKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

const BALANCE_TOKEN_TREND_LEGEND = ['输入 Tokens', '输出 Tokens', '缓存 Tokens'] as const

export function getBalanceTokenTrendQueryWindow(range: BalanceTokenTrendRange, now: Date = new Date()) {
  const endDate = addHours(startOfHour(now), 1)

  if (range === '24h') {
    return {
      start: toShanghaiApiDateTime(addHours(endDate, -24)) ?? '',
      end: toShanghaiApiDateTime(endDate) ?? '',
    }
  }

  const days = range === '7d' ? 7 : 30

  return {
    start: toShanghaiApiDateTime(startOfDay(addDays(endDate, -(days - 1)))) ?? '',
    end: toShanghaiApiDateTime(endDate) ?? '',
  }
}

function mergeUsageStatsByHour(stats: RouterUsageStat[]) {
  const buckets = new Map<number, BalanceTokenTrendPoint>()

  stats.forEach((item) => {
    const hourStart = startOfHour(toDate(item.stat_hour))
    const key = hourStart.getTime()
    const current = buckets.get(key) ?? {
      bucketStart: hourStart.toISOString(),
      label: formatHourLabel(hourStart),
      promptTokens: 0,
      completionTokens: 0,
      cachedTokens: 0,
    }

    current.promptTokens += item.prompt_tokens
    current.completionTokens += item.completion_tokens
    current.cachedTokens += item.cached_tokens
    buckets.set(key, current)
  })

  return buckets
}

export function buildBalanceTokenTrendViewModel(
  stats: RouterUsageStat[],
  range: BalanceTokenTrendRange,
  now: Date = new Date()
): BalanceTokenTrendViewModel {
  const { start, end } = getBalanceTokenTrendQueryWindow(range, now)
  const startDate = toDate(start)
  const endDate = toDate(end)
  const hourlyBuckets = mergeUsageStatsByHour(stats)
  const points: BalanceTokenTrendPoint[] = []

  if (range === '24h') {
    for (let index = 0; index < 24; index += 1) {
      const bucketDate = addHours(startDate, index)
      const bucket = hourlyBuckets.get(bucketDate.getTime()) ?? {
        bucketStart: bucketDate.toISOString(),
        label: formatHourLabel(bucketDate),
        promptTokens: 0,
        completionTokens: 0,
        cachedTokens: 0,
      }
      points.push(bucket)
    }
  } else {
    const dailyTotals = new Map<string, Pick<BalanceTokenTrendPoint, 'promptTokens' | 'completionTokens' | 'cachedTokens'>>()

    hourlyBuckets.forEach((bucket) => {
      const bucketDate = toDate(bucket.bucketStart)
      if (bucketDate < startDate || bucketDate >= endDate) {
        return
      }

      const dayKey = formatLocalDayKey(bucketDate)
      const current = dailyTotals.get(dayKey) ?? {
        promptTokens: 0,
        completionTokens: 0,
        cachedTokens: 0,
      }

      current.promptTokens += bucket.promptTokens
      current.completionTokens += bucket.completionTokens
      current.cachedTokens += bucket.cachedTokens
      dailyTotals.set(dayKey, current)
    })

    const days = range === '7d' ? 7 : 30

    for (let index = 0; index < days; index += 1) {
      const dayDate = addDays(startDate, index)
      const dayKey = formatLocalDayKey(dayDate)
      const total = dailyTotals.get(dayKey)

      points.push({
        bucketStart: dayDate.toISOString(),
        label: formatMonthDayLabel(dayDate),
        promptTokens: total?.promptTokens ?? 0,
        completionTokens: total?.completionTokens ?? 0,
        cachedTokens: total?.cachedTokens ?? 0,
      })
    }
  }

  const promptSeries = points.map((point) => point.promptTokens)
  const completionSeries = points.map((point) => point.completionTokens)
  const cachedSeries = points.map((point) => point.cachedTokens)

  return {
    start,
    end,
    points,
    xAxis: points.map((point) => point.label),
    legend: [...BALANCE_TOKEN_TREND_LEGEND],
    series: [
      { name: BALANCE_TOKEN_TREND_LEGEND[0], data: promptSeries },
      { name: BALANCE_TOKEN_TREND_LEGEND[1], data: completionSeries },
      { name: BALANCE_TOKEN_TREND_LEGEND[2], data: cachedSeries },
    ],
    hasData: [...promptSeries, ...completionSeries, ...cachedSeries].some((value) => value > 0),
  }
}

export function buildBalanceTokenTrendViewModelFromWindow(
  stats: RouterUsageStat[],
  start: string,
  end: string,
): BalanceTokenTrendViewModel {
  const startDate = toDate(start)
  const endDate = toDate(end)
  const durationMs = endDate.getTime() - startDate.getTime()
  const isHourly = durationMs <= 48 * 60 * 60 * 1000
  const hourlyBuckets = mergeUsageStatsByHour(stats)
  const points: BalanceTokenTrendPoint[] = []

  if (isHourly) {
    const cursor = startOfHour(startDate)
    while (cursor <= endDate) {
      const bucket = hourlyBuckets.get(cursor.getTime()) ?? {
        bucketStart: cursor.toISOString(),
        label: formatHourLabel(cursor),
        promptTokens: 0,
        completionTokens: 0,
        cachedTokens: 0,
      }
      points.push(bucket)
      cursor.setTime(cursor.getTime() + 60 * 60 * 1000)
    }
  } else {
    const dailyTotals = new Map<string, Pick<BalanceTokenTrendPoint, 'promptTokens' | 'completionTokens' | 'cachedTokens'>>()

    hourlyBuckets.forEach((bucket) => {
      const bucketDate = toDate(bucket.bucketStart)
      if (bucketDate < startDate || bucketDate >= endDate) return
      const dayKey = formatLocalDayKey(bucketDate)
      const current = dailyTotals.get(dayKey) ?? { promptTokens: 0, completionTokens: 0, cachedTokens: 0 }
      current.promptTokens += bucket.promptTokens
      current.completionTokens += bucket.completionTokens
      current.cachedTokens += bucket.cachedTokens
      dailyTotals.set(dayKey, current)
    })

    const cursor = startOfDay(startDate)
    while (cursor <= endDate) {
      const dayKey = formatLocalDayKey(cursor)
      const total = dailyTotals.get(dayKey)
      points.push({
        bucketStart: cursor.toISOString(),
        label: formatMonthDayLabel(cursor),
        promptTokens: total?.promptTokens ?? 0,
        completionTokens: total?.completionTokens ?? 0,
        cachedTokens: total?.cachedTokens ?? 0,
      })
      cursor.setDate(cursor.getDate() + 1)
    }
  }

  const promptSeries = points.map((point) => point.promptTokens)
  const completionSeries = points.map((point) => point.completionTokens)
  const cachedSeries = points.map((point) => point.cachedTokens)

  return {
    start,
    end,
    points,
    xAxis: points.map((point) => point.label),
    legend: [...BALANCE_TOKEN_TREND_LEGEND],
    series: [
      { name: BALANCE_TOKEN_TREND_LEGEND[0], data: promptSeries },
      { name: BALANCE_TOKEN_TREND_LEGEND[1], data: completionSeries },
      { name: BALANCE_TOKEN_TREND_LEGEND[2], data: cachedSeries },
    ],
    hasData: [...promptSeries, ...completionSeries, ...cachedSeries].some((value) => value > 0),
  }
}

export function filterUsageEventsByRange(
  events: RouterUsageEvent[],
  range: UsageRange,
  now: Date = new Date()
) {
  const windowMs: Record<UsageRange, number> = {
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
  }
  const start = now.getTime() - windowMs[range]
  return events.filter((event) => toDate(event.created_at).getTime() >= start)
}

export function summarizeUsageEvents(events: RouterUsageEvent[], currency = 'CNY'): UsageAggregate {
  if (events.length === 0) {
    return {
      totalRequests: 0,
      successRequests: 0,
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      totalCost: 0,
      averageLatencyMs: null,
      currency,
    }
  }

  let latencyTotal = 0
  let latencyCount = 0

  const summary = events.reduce<UsageAggregate>(
    (acc, event) => {
      acc.totalRequests += 1
      if (event.status === 1) {
        acc.successRequests += 1
      }
      acc.totalTokens += event.total_tokens
      acc.promptTokens += event.prompt_tokens
      acc.completionTokens += event.completion_tokens
      acc.totalCost += event.cost
      if (typeof event.duration_ms === 'number') {
        latencyTotal += event.duration_ms
        latencyCount += 1
      }
      return acc
    },
    {
      totalRequests: 0,
      successRequests: 0,
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      totalCost: 0,
      averageLatencyMs: null,
      currency,
    }
  )

  summary.averageLatencyMs = latencyCount > 0 ? Math.round(latencyTotal / latencyCount) : null
  return summary
}

export function usageSummaryToAggregate(summary: RouterUsageSummary | null): UsageAggregate {
  return {
    totalRequests: summary?.total_requests ?? 0,
    successRequests: summary?.success_requests ?? 0,
    totalTokens: summary?.total_tokens ?? 0,
    promptTokens: summary?.prompt_tokens ?? 0,
    completionTokens: summary?.completion_tokens ?? 0,
    totalCost: summary?.total_cost ?? 0,
    averageLatencyMs: null,
    currency: summary?.currency ?? 'CNY',
  }
}

export function buildModelUsageStats(events: RouterUsageEvent[]) {
  const bucket = new Map<string, ModelUsageStat>()
  events.forEach((event) => {
    const model = normalizeModelLabel(event.effective_model || 'unknown')
    const current = bucket.get(model) ?? {
      model,
      requests: 0,
      totalTokens: 0,
      totalCost: 0,
    }
    current.requests += 1
    current.totalTokens += event.total_tokens
    current.totalCost += event.cost
    bucket.set(model, current)
  })
  return Array.from(bucket.values()).sort((left, right) => right.totalCost - left.totalCost)
}

export function buildDailyTrend(events: RouterUsageEvent[]) {
  const bucket = new Map<string, DailyTrendPoint>()
  events.forEach((event) => {
    const date = event.created_at.slice(0, 10)
    const current = bucket.get(date) ?? {
      date,
      requests: 0,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      totalCost: 0,
    }
    current.requests += 1
    current.promptTokens += event.prompt_tokens
    current.completionTokens += event.completion_tokens
    current.totalTokens += event.total_tokens
    current.totalCost += event.cost
    bucket.set(date, current)
  })
  return Array.from(bucket.values()).sort((left, right) => left.date.localeCompare(right.date))
}

export const USAGE_REFERENCE_MODELS: UsageComparisonModelOption[] = [
  { id: 'claude-sonnet-4.6', name: 'Claude Sonnet 4.6', color: '#8B5CF6' },
  { id: 'claude-opus-4.6', name: 'Claude Opus 4.6', color: '#f97316' },
  { id: 'gpt-5.4', name: 'GPT-5.4', color: '#F59E0B' },
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', color: '#10B981' },
]

const MODEL_ALIASES: Array<{ label: string; matchers: string[] }> = [
  { label: 'Claude Sonnet 4.6', matchers: ['claude sonnet 4.6', 'claude-sonnet-4.6'] },
  { label: 'Claude Opus 4.6', matchers: ['claude opus 4.6', 'claude-opus-4.6'] },
  { label: 'GPT-5.4', matchers: ['gpt-5.4', 'gpt 5.4'] },
  { label: 'Gemini 3.1 Pro', matchers: ['gemini 3.1 pro', 'gemini-3.1-pro'] },
  { label: 'Claude-3.5', matchers: ['claude-3.5', 'claude 3.5', 'claude-3-5'] },
  { label: 'GPT-4o', matchers: ['gpt-4o', 'gpt 4o'] },
  { label: 'GPT-4', matchers: ['gpt-4', 'gpt 4'] },
  { label: 'Gemini Pro', matchers: ['gemini', 'gemini-pro', 'gemini pro'] },
  { label: 'Llama-3', matchers: ['llama-3', 'llama 3'] },
  { label: 'DeepSeek', matchers: ['deepseek'] },
  { label: 'Moonshot', matchers: ['moonshot', 'kimi'] },
]

const COST_MULTIPLIERS: Record<string, Record<string, number>> = {
  'claude-sonnet-4.6': {
    'Claude Sonnet 4.6': 1,
    'Claude Opus 4.6': 1.6,
    'GPT-5.4': 1.35,
    'Gemini 3.1 Pro': 0.82,
    'Claude-3.5': 1,
    'GPT-4o': 1.15,
    'GPT-4': 0.9,
    'Gemini Pro': 5.5,
    'Llama-3': 9,
    'DeepSeek': 12,
    'Moonshot': 3,
  },
  'claude-opus-4.6': {
    'Claude Sonnet 4.6': 0.62,
    'Claude Opus 4.6': 1,
    'GPT-5.4': 0.84,
    'Gemini 3.1 Pro': 0.52,
    'Claude-3.5': 0.87,
    'GPT-4o': 1,
    'GPT-4': 0.78,
    'Gemini Pro': 4.8,
    'Llama-3': 7.8,
    'DeepSeek': 10.4,
    'Moonshot': 2.6,
  },
  'gpt-5.4': {
    'Claude Sonnet 4.6': 0.74,
    'Claude Opus 4.6': 1.18,
    'GPT-5.4': 1,
    'Gemini 3.1 Pro': 0.61,
    'Claude-3.5': 1.1,
    'GPT-4o': 1.28,
    'GPT-4': 1,
    'Gemini Pro': 6,
    'Llama-3': 10,
    'DeepSeek': 13.3,
    'Moonshot': 3.3,
  },
  'gemini-3.1-pro': {
    'Claude Sonnet 4.6': 1.22,
    'Claude Opus 4.6': 1.92,
    'GPT-5.4': 1.65,
    'Gemini 3.1 Pro': 1,
    'Claude-3.5': 0.5,
    'GPT-4o': 0.6,
    'GPT-4': 0.45,
    'Gemini Pro': 3,
    'Llama-3': 5,
    'DeepSeek': 6,
    'Moonshot': 2,
  },
}

export function normalizeModelLabel(modelName: string) {
  const normalized = modelName.trim().toLowerCase()
  const matched = MODEL_ALIASES.find((item) =>
    item.matchers.some((matcher) => normalized.includes(matcher))
  )
  if (matched) {
    return matched.label
  }
  return modelName
}

export function estimateUsageComparison(
  modelStats: ModelUsageStat[],
  actualCost: number,
  referenceModelId: string
): UsageComparisonData {
  const multipliers = COST_MULTIPLIERS[referenceModelId] || COST_MULTIPLIERS['claude-sonnet-4.6']
  const theoreticalCost = modelStats.reduce((total, item) => {
    return total + item.totalCost * (multipliers[item.model] || 1)
  }, 0)
  const savedAmount = theoreticalCost - actualCost
  const savingsPercentage = theoreticalCost > 0 ? (savedAmount / theoreticalCost) * 100 : 0
  const referenceModelName =
    USAGE_REFERENCE_MODELS.find((item) => item.id === referenceModelId)?.name || 'Claude Sonnet 4.6'

  return {
    actualCost,
    theoreticalCost,
    savedAmount,
    savingsPercentage,
    referenceModelName,
    isSaving: savedAmount >= 0,
  }
}

export function createUsageDashboardViewModel(options: {
  events: RouterUsageEvent[]
  summary: RouterUsageSummary | null
  referenceModelId: string
  range: UsageRange
  now?: Date
}) {
  const filteredEvents = filterUsageEventsByRange(options.events, options.range, options.now)
  const currency = extractCurrency(options.summary)
  const aggregate = filteredEvents.length > 0
    ? summarizeUsageEvents(filteredEvents, currency)
    : options.events.length === 0
      ? usageSummaryToAggregate(options.summary)
      : summarizeUsageEvents([], currency)
  const modelStats = buildModelUsageStats(filteredEvents)
  const dailyTrend = buildDailyTrend(filteredEvents)
  const comparison = estimateUsageComparison(modelStats, aggregate.totalCost, options.referenceModelId)
  const successRate = calculateSuccessRate(aggregate)

  return {
    aggregate,
    currency,
    modelStats,
    dailyTrend,
    comparison,
    successRate,
    hasEvents: filteredEvents.length > 0,
  } satisfies UsageDashboardViewModel
}

export function countActiveKeys(keys: RouterApiKey[]) {
  return keys.filter((item) => item.is_active).length
}

export function sumPrepaidBalance(keys: RouterApiKey[]) {
  return keys.reduce((total, item) => {
    if (item.billing_mode !== 'prepaid') {
      return total
    }
    return total + (item.balance ?? 0)
  }, 0)
}

export function calculateSuccessRate(summary: Pick<UsageAggregate, 'successRequests' | 'totalRequests'>) {
  if (summary.totalRequests <= 0) {
    return 0
  }
  return (summary.successRequests / summary.totalRequests) * 100
}

export function calculateMonthlySpend(events: RouterUsageEvent[], now: Date = new Date()) {
  const year = now.getFullYear()
  const month = now.getMonth()
  return events.reduce((total, event) => {
    const createdAt = toDate(event.created_at)
    if (createdAt.getFullYear() === year && createdAt.getMonth() === month) {
      return total + event.cost
    }
    return total
  }, 0)
}

export function extractCurrency(summary: RouterUsageSummary | null) {
  if (summary?.currency) {
    return summary.currency
  }
  return 'CNY'
}

export function formatCurrency(amount: number, currency: string) {
  const symbol = (currency || 'CNY') === 'CNY' ? '￥' : currency
  return `${symbol}${amount.toFixed(2)}`
}

export function formatCurrencyDetail(amount: number, currency: string) {
  const symbol = (currency || 'CNY') === 'CNY' ? '￥' : currency
  return `${symbol}${amount.toFixed(6)}`
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    notation: value >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatTokenAxisValue(value: number) {
  if (Math.abs(value) >= 1000000) {
    return `${Number((value / 1000000).toFixed(1)).toString()}m`
  }
  if (Math.abs(value) >= 1000) {
    return `${Number((value / 1000).toFixed(1)).toString()}k`
  }
  return `${value}`
}

export function formatDateTime(value: string | null | undefined) {
  return formatShanghaiDateTime(value)
}
