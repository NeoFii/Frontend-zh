import {
  buildDailyTrend,
  buildBalanceTokenTrendViewModel,
  buildModelUsageStats,
  calculateMonthlySpend,
  calculateSuccessRate,
  countActiveKeys,
  createUsageDashboardViewModel,
  filterUsageEventsByRange,
  formatTokenAxisValue,
  formatCurrency,
  getBalanceTokenTrendQueryWindow,
  normalizeModelLabel,
  summarizeUsageEvents,
  sumPrepaidBalance,
} from '@/lib/router-analytics'
import type { RouterUsageStat } from '@/lib/api/router'

process.env.TZ = 'Asia/Shanghai'

const baseEvent = {
  request_id: 'req_1',
  api_key_id: 1,
  model_name: 'gpt-4o',
  selected_model: null as string | null,
  provider_slug: null as string | null,
  prompt_tokens: 100,
  completion_tokens: 50,
  cached_tokens: 0,
  total_tokens: 150,
  cost: 0.5,
  is_stream: false,
  routing_tier: null as number | null,
  config_version: null as number | null,
  config_source: null as string | null,
  router_trace_id: null as string | null,
  error_code: null,
  error_msg: null,
  duration_ms: 120,
}

describe('router analytics helpers', () => {
  it('filters events by time range', () => {
    const now = new Date('2026-03-11T12:00:00Z')
    const recent = { ...baseEvent, id: 1, status: 1, created_at: '2026-03-10T12:00:00Z' }
    const old = { ...baseEvent, id: 2, status: 1, created_at: '2026-03-01T12:00:00Z' }

    expect(filterUsageEventsByRange([recent, old], '7d', now)).toHaveLength(1)
  })

  it('summarizes usage events', () => {
    const events = [
      { ...baseEvent, id: 1, status: 1, created_at: '2026-03-10T12:00:00Z' },
      { ...baseEvent, id: 2, status: 2, cost: 0.25, total_tokens: 80, created_at: '2026-03-10T13:00:00Z' },
    ]
    const result = summarizeUsageEvents(events)

    expect(result.totalRequests).toBe(2)
    expect(result.successRequests).toBe(1)
    expect(result.totalCost).toBeCloseTo(0.75)
    expect(result.totalTokens).toBe(230)
    expect(result.averageLatencyMs).toBe(120)
  })

  it('builds model and daily trend aggregates', () => {
    const events = [
      { ...baseEvent, id: 1, status: 1, model_name: 'gpt-4o', created_at: '2026-03-10T12:00:00Z' },
      { ...baseEvent, id: 2, status: 1, model_name: 'claude-3.5', cost: 1.2, created_at: '2026-03-10T16:00:00Z' },
      { ...baseEvent, id: 3, status: 1, model_name: 'gpt-4o', cost: 0.1, created_at: '2026-03-11T08:00:00Z' },
    ]

    const modelStats = buildModelUsageStats(events)
    const trend = buildDailyTrend(events)

    expect(modelStats[0].model).toBe('Claude-3.5')
    expect(trend).toHaveLength(2)
    expect(trend[0].requests).toBe(2)
  })

  it('normalizes model names and builds dashboard comparison', () => {
    const events = [
      { ...baseEvent, id: 1, status: 1, model_name: 'gpt-4o-2024-08-06', created_at: '2026-03-10T12:00:00Z' },
      { ...baseEvent, id: 2, status: 1, model_name: 'claude-3-5-sonnet', cost: 1.2, created_at: '2026-03-10T16:00:00Z' },
    ]

    expect(normalizeModelLabel('gpt-4o-2024-08-06')).toBe('GPT-4o')

    const viewModel = createUsageDashboardViewModel({
      events,
      summary: null,
      referenceModelId: 'claude-sonnet-4.6',
      range: '7d',
      now: new Date('2026-03-11T00:00:00Z'),
    })

    expect(viewModel.modelStats).toHaveLength(2)
    expect(viewModel.comparison.referenceModelName).toBe('Claude Sonnet 4.6')
    expect(viewModel.hasEvents).toBe(true)
  })

  it('calculates balances and spend', () => {
    const keys = [
      { id: 1, is_active: true, billing_mode: 'prepaid', balance: 10 },
      { id: 2, is_active: false, billing_mode: 'postpaid', balance: 15 },
      { id: 3, is_active: true, billing_mode: 'prepaid', balance: 5.5 },
    ]
    const events = [
      { ...baseEvent, id: 1, status: 1, created_at: '2026-03-02T12:00:00Z' },
      { ...baseEvent, id: 2, status: 1, cost: 0.25, created_at: '2026-02-25T12:00:00Z' },
    ]

    expect(countActiveKeys(keys as never)).toBe(2)
    expect(sumPrepaidBalance(keys as never)).toBeCloseTo(15.5)
    expect(calculateSuccessRate({ totalRequests: 10, successRequests: 9 })).toBe(90)
    expect(calculateMonthlySpend(events, new Date('2026-03-11T00:00:00Z'))).toBeCloseTo(0.5)
    expect(formatCurrency(12.5, 'CNY')).toBe('CNY 12.50')
  })

  it('aligns the 24h query window to completed hourly buckets', () => {
    const now = new Date('2026-04-23T10:35:00+08:00')

    expect(getBalanceTokenTrendQueryWindow('24h', now)).toEqual({
      start: '2026-04-22T02:00:00.000Z',
      end: '2026-04-23T02:00:00.000Z',
    })
  })

  it('merges multi-model rows into 24 hourly token buckets and fills gaps', () => {
    const now = new Date('2026-04-23T10:35:00+08:00')
    const stats: RouterUsageStat[] = [
      {
        stat_hour: '2026-04-22T10:00:00+08:00',
        request_count: 3,
        success_count: 3,
        error_count: 0,
        prompt_tokens: 120,
        completion_tokens: 60,
        cached_tokens: 30,
        total_tokens: 210,
        total_cost: 0.9,
      },
      {
        stat_hour: '2026-04-22T10:00:00+08:00',
        request_count: 2,
        success_count: 2,
        error_count: 0,
        prompt_tokens: 80,
        completion_tokens: 40,
        cached_tokens: 20,
        total_tokens: 140,
        total_cost: 0.4,
      },
      {
        stat_hour: '2026-04-23T09:00:00+08:00',
        request_count: 4,
        success_count: 4,
        error_count: 0,
        prompt_tokens: 200,
        completion_tokens: 100,
        cached_tokens: 50,
        total_tokens: 350,
        total_cost: 1.2,
      },
    ]

    const viewModel = buildBalanceTokenTrendViewModel(stats, '24h', now)

    expect(viewModel.points).toHaveLength(24)
    expect(viewModel.points[0]).toMatchObject({
      bucketStart: '2026-04-22T02:00:00.000Z',
      promptTokens: 200,
      completionTokens: 100,
      cachedTokens: 50,
    })
    expect(viewModel.points[1]).toMatchObject({
      promptTokens: 0,
      completionTokens: 0,
      cachedTokens: 0,
    })
    expect(viewModel.points[23]).toMatchObject({
      bucketStart: '2026-04-23T01:00:00.000Z',
      promptTokens: 200,
      completionTokens: 100,
      cachedTokens: 50,
    })
    expect(viewModel.xAxis).toHaveLength(24)
    expect(viewModel.legend).toEqual(['输入 Tokens', '输出 Tokens', '缓存 Tokens'])
  })

  it('builds seven local-day buckets in ascending order', () => {
    const now = new Date('2026-04-23T10:35:00+08:00')
    const stats: RouterUsageStat[] = [
      {
        stat_hour: '2026-04-17T12:00:00+08:00',
        request_count: 2,
        success_count: 2,
        error_count: 0,
        prompt_tokens: 100,
        completion_tokens: 50,
        cached_tokens: 20,
        total_tokens: 170,
        total_cost: 0.4,
      },
      {
        stat_hour: '2026-04-17T18:00:00+08:00',
        request_count: 2,
        success_count: 2,
        error_count: 0,
        prompt_tokens: 60,
        completion_tokens: 30,
        cached_tokens: 10,
        total_tokens: 100,
        total_cost: 0.2,
      },
      {
        stat_hour: '2026-04-23T09:00:00+08:00',
        request_count: 1,
        success_count: 1,
        error_count: 0,
        prompt_tokens: 40,
        completion_tokens: 20,
        cached_tokens: 5,
        total_tokens: 65,
        total_cost: 0.1,
      },
    ]

    const viewModel = buildBalanceTokenTrendViewModel(stats, '7d', now)

    expect(viewModel.points).toHaveLength(7)
    expect(viewModel.points[0].label).toBe('04-17')
    expect(viewModel.points[0]).toMatchObject({
      promptTokens: 160,
      completionTokens: 80,
      cachedTokens: 30,
    })
    expect(viewModel.points[6].label).toBe('04-23')
    expect(viewModel.points[6]).toMatchObject({
      promptTokens: 40,
      completionTokens: 20,
      cachedTokens: 5,
    })
    expect(viewModel.xAxis).toEqual([...viewModel.xAxis].sort())
  })

  it('builds thirty local-day buckets for the 30d range', () => {
    const now = new Date('2026-04-23T10:35:00+08:00')
    const stats: RouterUsageStat[] = [
      {
        stat_hour: '2026-03-25T12:00:00+08:00',
        request_count: 2,
        success_count: 2,
        error_count: 0,
        prompt_tokens: 70,
        completion_tokens: 35,
        cached_tokens: 10,
        total_tokens: 115,
        total_cost: 0.3,
      },
      {
        stat_hour: '2026-04-23T08:00:00+08:00',
        request_count: 1,
        success_count: 1,
        error_count: 0,
        prompt_tokens: 90,
        completion_tokens: 45,
        cached_tokens: 15,
        total_tokens: 150,
        total_cost: 0.4,
      },
    ]

    const viewModel = buildBalanceTokenTrendViewModel(stats, '30d', now)

    expect(viewModel.points).toHaveLength(30)
    expect(viewModel.points[0].label).toBe('03-25')
    expect(viewModel.points[29].label).toBe('04-23')
  })

  it('formats token axis values with k and m suffixes', () => {
    expect(formatTokenAxisValue(999)).toBe('999')
    expect(formatTokenAxisValue(1500)).toBe('1.5k')
    expect(formatTokenAxisValue(2500000)).toBe('2.5m')
  })
})
