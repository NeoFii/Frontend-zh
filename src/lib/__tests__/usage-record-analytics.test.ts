import { buildUsageRecordAnalyticsViewModel, buildUsageRecordTimeWindow } from '@/lib/usage-record-analytics'
import type { RouterUsageAnalytics } from '@/lib/api/router'

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
    expect(window.start).toBe('2026-04-24T00:45:00.000Z')
    expect(window.end).toBe('2026-04-24T08:45:00.000Z')
  })
})
