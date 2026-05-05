import {
  buildUsageRecordAnalyticsViewModel,
  buildUsageRecordFallbackAnalytics,
  buildUsageRecordTimeWindow,
} from '@/lib/usage-record-analytics'
import type { RouterUsageAnalytics, RouterUsageEvent, RouterUsageStat } from '@/lib/api/router'

function createAnalyticsFixture(): RouterUsageAnalytics {
  return {
    range: '8h',
    granularity: 'hour',
    start: '2026-04-24T00:00:00Z',
    end: '2026-04-24T08:00:00Z',
    currency: 'CNY',
    overview: {
      total_requests: 55,
      success_requests: 50,
      success_rate: 0.9091,
      total_cost: 55,
    },
    models: [
      { effective_model: 'model-1', request_count: 10, request_share: 0.18, total_cost: 10 },
      { effective_model: 'model-2', request_count: 9, request_share: 0.16, total_cost: 9 },
      { effective_model: 'model-3', request_count: 8, request_share: 0.15, total_cost: 8 },
      { effective_model: 'model-4', request_count: 7, request_share: 0.13, total_cost: 7 },
      { effective_model: 'model-5', request_count: 6, request_share: 0.11, total_cost: 6 },
      { effective_model: 'model-6', request_count: 5, request_share: 0.09, total_cost: 5 },
      { effective_model: 'model-7', request_count: 4, request_share: 0.07, total_cost: 4 },
      { effective_model: 'model-8', request_count: 3, request_share: 0.05, total_cost: 3 },
      { effective_model: 'tail-a', request_count: 2, request_share: 0.04, total_cost: 2 },
      { effective_model: 'tail-b', request_count: 1, request_share: 0.02, total_cost: 1 },
    ],
    buckets: [
      {
        bucket_start: '2026-04-24T00:00:00Z',
        label: '08:00',
        costs: [
          { effective_model: 'model-1', total_cost: 3 },
          { effective_model: 'model-2', total_cost: 2 },
          { effective_model: 'tail-a', total_cost: 0.7 },
        ],
      },
      {
        bucket_start: '2026-04-24T01:00:00Z',
        label: '09:00',
        costs: [
          { effective_model: 'model-1', total_cost: 1 },
          { effective_model: 'tail-a', total_cost: 0.2 },
          { effective_model: 'tail-b', total_cost: 0.1 },
        ],
      },
    ],
  }
}

describe('usage record analytics helpers', () => {
  it('collapses the long tail into 其他 and reuses one color map across ranking, donut, and stacked series', () => {
    const viewModel = buildUsageRecordAnalyticsViewModel(createAnalyticsFixture())

    expect(viewModel.models.map((item) => item.model)).toEqual([
      'model-1',
      'model-2',
      'model-3',
      'model-4',
      'model-5',
      'model-6',
      'model-7',
      'model-8',
      '其他',
    ])

    const primaryColor = viewModel.colorMap['model-1']
    expect(primaryColor).toBeTruthy()
    expect(viewModel.donut.find((item) => item.model === 'model-1')?.color).toBe(primaryColor)
    expect(viewModel.stackedBar.series.find((item) => item.model === 'model-1')?.color).toBe(primaryColor)
    expect(viewModel.ranking.find((item) => item.model === 'model-1')?.color).toBe(primaryColor)

    expect(viewModel.stackedBar.series.find((item) => item.model === '其他')?.data).toEqual([0.7, 0.3])
    expect(viewModel.donut.find((item) => item.model === '其他')).toEqual(
      expect.objectContaining({
        requestCount: 3,
        totalCost: 3,
      })
    )
  })

  it('builds local datetime filter values for the selected default range', () => {
    const now = new Date('2026-04-24T16:45:30+08:00')
    const window = buildUsageRecordTimeWindow('8h', now)

    expect(window.startInput).toBe('2026-04-24T08:45')
    expect(window.endInput).toBe('2026-04-24T16:45')
    expect(window.start).toBe('2026-04-24T08:45:00+08:00')
    expect(window.end).toBe('2026-04-24T16:45:00+08:00')
  })

  it('builds fallback analytics from usage stats and raw events when the analytics endpoint is unavailable', () => {
    const stats: RouterUsageStat[] = [
      {
        stat_hour: '2026-04-24T09:00:00',
        request_count: 3,
        success_count: 2,
        error_count: 1,
        prompt_tokens: 300,
        completion_tokens: 90,
        cached_tokens: 0,
        total_tokens: 390,
        total_cost: 6,
      },
    ]
    const events: RouterUsageEvent[] = [
      {
        id: 1,
        request_id: 'req-1',
        api_key_id: 1,
        effective_model: 'gpt-4.1-mini-2026-04-14',
        prompt_tokens: 100,
        completion_tokens: 30,
        cached_tokens: 0,
        total_tokens: 130,
        cost: 1.5,
        status: 1,
        duration_ms: 210,
        is_stream: false,
        routing_tier: null,
        config_version: null,
        config_source: null,
        router_trace_id: null,
        error_code: null,
        error_msg: null,
        created_at: '2026-04-24T09:05:00',
      },
      {
        id: 2,
        request_id: 'req-2',
        api_key_id: 1,
        effective_model: 'claude-3-7-sonnet-2026-02-19',
        prompt_tokens: 120,
        completion_tokens: 40,
        cached_tokens: 0,
        total_tokens: 160,
        cost: 3.5,
        status: 2,
        duration_ms: 260,
        is_stream: false,
        routing_tier: null,
        config_version: null,
        config_source: null,
        router_trace_id: null,
        error_code: 'rate_limit',
        error_msg: 'rate limited',
        created_at: '2026-04-24T09:35:00',
      },
      {
        id: 3,
        request_id: 'req-3',
        api_key_id: 2,
        effective_model: 'gpt-4.1-mini-2026-04-14',
        prompt_tokens: 90,
        completion_tokens: 20,
        cached_tokens: 0,
        total_tokens: 110,
        cost: 1,
        status: 1,
        duration_ms: 190,
        is_stream: false,
        routing_tier: null,
        config_version: null,
        config_source: null,
        router_trace_id: null,
        error_code: null,
        error_msg: null,
        created_at: '2026-04-24T15:10:00',
      },
    ]

    const analytics = buildUsageRecordFallbackAnalytics({
      range: '8h',
      stats,
      events,
      now: new Date('2026-04-24T16:45:00+08:00'),
      currency: 'CNY',
    })

    expect(analytics.granularity).toBe('hour')
    expect(analytics.overview).toEqual({
      total_requests: 3,
      success_requests: 2,
      success_rate: 2 / 3,
      total_cost: 6,
    })
    expect(analytics.models).toEqual([
      {
        effective_model: 'gpt-4.1-mini-2026-04-14',
        request_count: 2,
        request_share: 2 / 3,
        total_cost: 2.5,
      },
      {
        effective_model: 'claude-3-7-sonnet-2026-02-19',
        request_count: 1,
        request_share: 1 / 3,
        total_cost: 3.5,
      },
    ])
    expect(analytics.buckets).toHaveLength(8)
    expect(analytics.buckets[0].label).toBe('09:00')
    expect(analytics.buckets[0].costs).toEqual([
      { effective_model: 'claude-3-7-sonnet-2026-02-19', total_cost: 3.5 },
      { effective_model: 'gpt-4.1-mini-2026-04-14', total_cost: 1.5 },
    ])
    expect(analytics.buckets[1].costs).toEqual([])
    expect(analytics.buckets[6].costs).toEqual([
      { effective_model: 'gpt-4.1-mini-2026-04-14', total_cost: 1 },
    ])
  })

  it('falls back to a single 汇总 aggregate bar when bucket costs are all zero but model totals exist', () => {
    const fixture: RouterUsageAnalytics = {
      range: '8h',
      granularity: 'hour',
      start: '2026-04-24T00:00:00Z',
      end: '2026-04-24T02:00:00Z',
      currency: 'CNY',
      overview: {
        total_requests: 5,
        success_requests: 5,
        success_rate: 1,
        total_cost: 12,
      },
      models: [
        { effective_model: 'model-a', request_count: 3, request_share: 0.6, total_cost: 9 },
        { effective_model: 'model-b', request_count: 2, request_share: 0.4, total_cost: 3 },
      ],
      buckets: [
        { bucket_start: '2026-04-24T00:00:00Z', label: '08:00', costs: [] },
        { bucket_start: '2026-04-24T01:00:00Z', label: '09:00', costs: [] },
      ],
    }

    const viewModel = buildUsageRecordAnalyticsViewModel(fixture)

    expect(viewModel.hasData).toBe(true)
    expect(viewModel.stackedBar.labels).toEqual(['汇总'])
    expect(viewModel.stackedBar.series.map((item) => ({ model: item.model, data: item.data }))).toEqual([
      { model: 'model-a', data: [9] },
      { model: 'model-b', data: [3] },
    ])
    // 颜色仍与 donut / ranking 共享同一个 colorMap
    expect(viewModel.stackedBar.series[0].color).toBe(viewModel.colorMap['model-a'])
    expect(viewModel.stackedBar.series[1].color).toBe(viewModel.colorMap['model-b'])
  })

  it('uses a palette that contains neither pure black nor pure white', () => {
    const viewModel = buildUsageRecordAnalyticsViewModel(createAnalyticsFixture())
    const blackish = new Set(['#000', '#000000', '#0f172a', '#020617'])
    const whitish = new Set(['#fff', '#ffffff', '#f8fafc'])
    for (const color of Object.values(viewModel.colorMap)) {
      const normalized = color.toLowerCase()
      expect(blackish.has(normalized)).toBe(false)
      expect(whitish.has(normalized)).toBe(false)
    }
  })
})
