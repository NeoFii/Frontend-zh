import {
  buildDailyTrend,
  buildModelUsageStats,
  calculateMonthlySpend,
  calculateSuccessRate,
  countActiveKeys,
  createUsageDashboardViewModel,
  filterUsageEventsByRange,
  formatCurrency,
  normalizeModelLabel,
  summarizeUsageEvents,
  sumPrepaidBalance,
} from '@/lib/router-analytics'

const baseEvent = {
  request_id: 'req_1',
  router_api_key_id: 1,
  provider_slug: 'openai',
  requested_model: 'smart-router',
  resolved_model: 'gpt-4o',
  prompt_tokens: 100,
  completion_tokens: 50,
  total_tokens: 150,
  cost_input: 0.2,
  cost_output: 0.3,
  cost_total: 0.5,
  currency: 'CNY',
  error_code: null,
  error_message: null,
  latency_ms: 120,
}

describe('router analytics helpers', () => {
  it('filters events by time range', () => {
    const now = new Date('2026-03-11T12:00:00Z')
    const recent = { ...baseEvent, id: 1, status_code: 200, created_at: '2026-03-10T12:00:00Z' }
    const old = { ...baseEvent, id: 2, status_code: 200, created_at: '2026-03-01T12:00:00Z' }

    expect(filterUsageEventsByRange([recent, old], '7d', now)).toHaveLength(1)
  })

  it('summarizes usage events', () => {
    const events = [
      { ...baseEvent, id: 1, status_code: 200, created_at: '2026-03-10T12:00:00Z' },
      { ...baseEvent, id: 2, status_code: 500, cost_total: 0.25, total_tokens: 80, created_at: '2026-03-10T13:00:00Z' },
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
      { ...baseEvent, id: 1, status_code: 200, resolved_model: 'gpt-4o', created_at: '2026-03-10T12:00:00Z' },
      { ...baseEvent, id: 2, status_code: 200, resolved_model: 'claude-3.5', cost_total: 1.2, created_at: '2026-03-10T16:00:00Z' },
      { ...baseEvent, id: 3, status_code: 200, resolved_model: 'gpt-4o', cost_total: 0.1, created_at: '2026-03-11T08:00:00Z' },
    ]

    const modelStats = buildModelUsageStats(events)
    const trend = buildDailyTrend(events)

    expect(modelStats[0].model).toBe('Claude-3.5')
    expect(trend).toHaveLength(2)
    expect(trend[0].requests).toBe(2)
  })

  it('normalizes model names and builds dashboard comparison', () => {
    const events = [
      { ...baseEvent, id: 1, status_code: 200, resolved_model: 'gpt-4o-2024-08-06', created_at: '2026-03-10T12:00:00Z' },
      { ...baseEvent, id: 2, status_code: 200, resolved_model: 'claude-3-5-sonnet', cost_total: 1.2, created_at: '2026-03-10T16:00:00Z' },
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
      { ...baseEvent, id: 1, status_code: 200, created_at: '2026-03-02T12:00:00Z' },
      { ...baseEvent, id: 2, status_code: 200, cost_total: 0.25, created_at: '2026-02-25T12:00:00Z' },
    ]

    expect(countActiveKeys(keys as never)).toBe(2)
    expect(sumPrepaidBalance(keys as never)).toBeCloseTo(15.5)
    expect(calculateSuccessRate({ totalRequests: 10, successRequests: 9 })).toBe(90)
    expect(calculateMonthlySpend(events, new Date('2026-03-11T00:00:00Z'))).toBeCloseTo(0.5)
    expect(formatCurrency(12.5, 'CNY')).toBe('CNY 12.50')
  })
})
