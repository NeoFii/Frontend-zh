import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import UsageRecordPage from './page'
import { buildUsageRecordAnalyticsWindow } from '@/lib/usage-record-analytics'

const mockChartRender = jest.fn()
const mockUseRouterBalance = jest.fn()
const mockUseRouterUsageAnalytics = jest.fn()
const mockUseRouterUsageEvents = jest.fn()
const mockUseRouterUsageStats = jest.fn()

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => (props: { option: unknown }) => {
    mockChartRender(props)
    return <div data-testid="usage-chart" />
  },
}))

jest.mock('echarts/core', () => ({
  use: jest.fn(),
}))

jest.mock('echarts/charts', () => ({
  BarChart: {},
  LineChart: {},
  PieChart: {},
}))

jest.mock('echarts/renderers', () => ({
  CanvasRenderer: {},
}))

jest.mock('echarts/components', () => ({
  GridComponent: {},
  LegendComponent: {},
  TooltipComponent: {},
}))

jest.mock('@/hooks/useRouterUsage', () => ({
  useRouterBalance: () => mockUseRouterBalance(),
  useRouterUsageAnalytics: (...args: unknown[]) => mockUseRouterUsageAnalytics(...args),
  useRouterUsageEvents: (...args: unknown[]) => mockUseRouterUsageEvents(...args),
  useRouterUsageStats: (...args: unknown[]) => mockUseRouterUsageStats(...args),
}))

function createAnalyticsFixture() {
  return {
    range: '8h' as const,
    granularity: 'hour' as const,
    start: '2026-04-24T00:00:00Z',
    end: '2026-04-24T08:00:00Z',
    currency: 'CNY',
    overview: {
      total_requests: 48,
      success_requests: 45,
      success_rate: 0.9375,
      total_cost: 12.34,
    },
    models: [
      {
        effective_model: 'gpt-4.1-mini-2026-04-14',
        request_count: 30,
        request_share: 0.625,
        total_cost: 7.89,
      },
      {
        effective_model: 'claude-3-7-sonnet-2026-02-19',
        request_count: 18,
        request_share: 0.375,
        total_cost: 4.45,
      },
    ],
    buckets: [
      {
        bucket_start: '2026-04-24T00:00:00Z',
        label: '08:00',
        costs: [
          { effective_model: 'gpt-4.1-mini-2026-04-14', total_cost: 2.34 },
          { effective_model: 'claude-3-7-sonnet-2026-02-19', total_cost: 1.45 },
        ],
      },
      {
        bucket_start: '2026-04-24T01:00:00Z',
        label: '09:00',
        costs: [
          { effective_model: 'gpt-4.1-mini-2026-04-14', total_cost: 2.11 },
          { effective_model: 'claude-3-7-sonnet-2026-02-19', total_cost: 0.95 },
        ],
      },
    ],
  }
}

describe('UsageRecordPage', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-04-24T16:45:00+08:00'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseRouterBalance.mockReturnValue({
      balance: {
        balance: 120,
        frozen_amount: 12,
        used_amount: 45,
        available_balance: 108,
        total_requests: 320,
        total_tokens: 17000,
        currency: 'CNY',
      },
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })

    mockUseRouterUsageAnalytics.mockReturnValue({
      analytics: createAnalyticsFixture(),
      isLoading: false,
      isError: null,
      isUnsupported: false,
      mutate: jest.fn(),
    })

    mockUseRouterUsageStats.mockReturnValue({
      stats: [],
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })

    mockUseRouterUsageEvents.mockReturnValue({
      events: [],
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })
  })

  it('defaults to the 8h range and renders four summary cards, analytics panels, and token trend', () => {
    render(<UsageRecordPage />)

    expect(screen.getByRole('button', { name: '8h' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('当前余额')).toBeInTheDocument()
    expect(screen.getByText('使用统计')).toBeInTheDocument()
    expect(screen.getByText('花费')).toBeInTheDocument()
    expect(screen.getByText('成功率')).toBeInTheDocument()
    expect(screen.getByText('费用分布')).toBeInTheDocument()
    expect(screen.getByText('请求占比')).toBeInTheDocument()
    expect(screen.getByText('请求排行')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Token 使用趋势' })).toBeInTheDocument()
    expect(screen.queryByText('请求明细')).not.toBeInTheDocument()
    expect(mockUseRouterUsageAnalytics).toHaveBeenLastCalledWith('8h')

    const trendRangeButtons = ['24h', '7d', '30d']
    for (const label of trendRangeButtons) {
      expect(screen.getAllByRole('button', { name: label }).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('uses sidebar-matched rounded-lg on the main card containers', () => {
    render(<UsageRecordPage />)

    const expectedCardLabels = ['当前余额', '使用统计', '花费', '成功率']
    for (const label of expectedCardLabels) {
      const card = screen.getByText(label).closest('div')
      expect(card).toHaveClass('rounded-lg')
      expect(card?.className).not.toMatch(/rounded-(2xl|3xl)/)
    }

    const expectedPanelTitles = ['费用分布', '请求占比', '请求排行', 'Token 使用趋势']
    for (const title of expectedPanelTitles) {
      const panel = screen.getByText(title).closest('section')
      expect(panel).toHaveClass('rounded-lg')
      expect(panel?.className).not.toMatch(/rounded-(2xl|3xl)/)
    }
  })

  it('renders the page backbone while initial usage data is loading', () => {
    mockUseRouterBalance.mockReturnValueOnce({
      balance: null,
      isLoading: true,
      isError: null,
      mutate: jest.fn(),
    })
    mockUseRouterUsageAnalytics.mockReturnValueOnce({
      analytics: null,
      isLoading: true,
      isError: null,
      isUnsupported: false,
      mutate: jest.fn(),
    })

    render(<UsageRecordPage />)

    expect(screen.getByRole('heading', { name: '使用记录' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '8h' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('当前余额')).toBeInTheDocument()
    expect(screen.getByText('使用统计')).toBeInTheDocument()
    expect(screen.getByText('花费')).toBeInTheDocument()
    expect(screen.getByText('成功率')).toBeInTheDocument()
    expect(screen.getByText('费用分布')).toBeInTheDocument()
    expect(screen.getByText('请求占比')).toBeInTheDocument()
    expect(screen.getByText('请求排行')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Token 使用趋势' })).toBeInTheDocument()
  })

  it('refreshes analytics when the global range changes without affecting the trend range', () => {
    render(<UsageRecordPage />)

    const mainRange24h = screen.getAllByRole('button', { name: '24h' })[0]
    fireEvent.click(mainRange24h)

    expect(mockUseRouterUsageAnalytics).toHaveBeenLastCalledWith('24h')
    expect(screen.getByRole('heading', { name: 'Token 使用趋势' })).toBeInTheDocument()
  })

  it('keeps the current usage layout visible while a new range loads with previous data', () => {
    const previousAnalytics = createAnalyticsFixture()
    mockUseRouterUsageAnalytics.mockImplementation((nextRange: string) => ({
      analytics: previousAnalytics,
      isLoading: nextRange === '24h',
      isError: null,
      isUnsupported: false,
      mutate: jest.fn(),
    }))

    render(<UsageRecordPage />)

    const mainRange24h = screen.getAllByRole('button', { name: '24h' })[0]
    fireEvent.click(mainRange24h)

    expect(mockUseRouterUsageAnalytics).toHaveBeenLastCalledWith('24h')
    expect(mainRange24h).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('当前余额')).toBeInTheDocument()
    expect(screen.getByText('费用分布')).toBeInTheDocument()
    expect(screen.getByText('请求占比')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Token 使用趋势' })).toBeInTheDocument()
    expect(screen.getAllByTestId('usage-chart').length).toBeGreaterThanOrEqual(2)
  })

  it('keeps the full page layout when the analytics endpoint returns 404', () => {
    mockUseRouterUsageAnalytics.mockReturnValueOnce({
      analytics: null,
      isLoading: false,
      isError: { response: { status: 404 } },
      isUnsupported: true,
      mutate: jest.fn(),
    })
    mockUseRouterUsageStats.mockReturnValueOnce({
      stats: [
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
      ],
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })
    mockUseRouterUsageEvents.mockReturnValueOnce({
      events: [
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
      ],
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })

    render(<UsageRecordPage />)

    const analyticsWindow = buildUsageRecordAnalyticsWindow('8h', new Date('2026-04-24T16:45:00+08:00'))

    expect(screen.queryByText('使用记录加载失败。')).not.toBeInTheDocument()
    expect(screen.getByText('当前余额')).toBeInTheDocument()
    expect(screen.getByText('费用分布')).toBeInTheDocument()
    expect(screen.getByText('请求占比')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Token 使用趋势' })).toBeInTheDocument()
    expect(mockUseRouterUsageStats).toHaveBeenCalledWith({
      start: analyticsWindow.start,
      end: analyticsWindow.end,
    })
    expect(mockUseRouterUsageEvents).toHaveBeenLastCalledWith({
      enabled: true,
      start: analyticsWindow.start,
      end: analyticsWindow.end,
      limit: 100,
      maxPages: 20,
    })
  })

  it('renders empty analytics as visual chart placeholders without no-data chart copy', () => {
    mockUseRouterUsageAnalytics.mockReturnValue({
      analytics: {
        ...createAnalyticsFixture(),
        overview: {
          total_requests: 0,
          success_requests: 0,
          success_rate: 0,
          total_cost: 0,
        },
        models: [],
        buckets: [],
      },
      isLoading: false,
      isError: null,
      isUnsupported: false,
      mutate: jest.fn(),
    })

    render(<UsageRecordPage />)

    expect(screen.queryByText('所选时间范围暂无模型花费分布')).not.toBeInTheDocument()
    expect(screen.queryByText('所选时间范围暂无模型请求占比')).not.toBeInTheDocument()
    expect(screen.queryByText('所选时间范围暂无模型请求排行')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('usage-chart').length).toBeGreaterThanOrEqual(2)
    fireEvent.click(screen.getByRole('button', { name: '请求排行' }))
    expect(screen.getByTestId('usage-ranking-empty')).toBeInTheDocument()
  })
})
