import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import BalancePage from './page'
import type { RouterUsageStat } from '@/lib/api/router'

const mockPush = jest.fn()
const mockChartRender = jest.fn()
const mockUseRouterKeys = jest.fn()
const mockUseRouterBalance = jest.fn()
const mockUseRouterUsageSummary = jest.fn()
const mockUseRouterUsageEvents = jest.fn()
const mockUseRouterUsageStats = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => (props: { option: unknown }) => {
    mockChartRender(props)
    return <div data-testid="token-trend-chart" />
  },
}))

jest.mock('echarts/core', () => ({
  use: jest.fn(),
}))

jest.mock('echarts/charts', () => ({
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

jest.mock('@/hooks/useRouterKeys', () => ({
  useRouterKeys: () => mockUseRouterKeys(),
}))

jest.mock('@/hooks/useRouterUsage', () => ({
  useRouterBalance: () => mockUseRouterBalance(),
  useRouterUsageSummary: () => mockUseRouterUsageSummary(),
  useRouterUsageEvents: () => mockUseRouterUsageEvents(),
  useRouterUsageStats: (...args: unknown[]) => mockUseRouterUsageStats(...args),
}))

function buildUsageStats(): RouterUsageStat[] {
  const days: RouterUsageStat[] = []
  const start = new Date('2026-03-25T08:00:00+08:00')

  for (let index = 0; index < 30; index += 1) {
    const statHour = new Date(start.getTime() + index * 24 * 60 * 60 * 1000)
    days.push({
      stat_hour: statHour.toISOString(),
      request_count: index + 1,
      success_count: index + 1,
      error_count: 0,
      prompt_tokens: (index + 1) * 100,
      completion_tokens: (index + 1) * 50,
      cached_tokens: (index + 1) * 20,
      total_tokens: (index + 1) * 170,
      total_cost: (index + 1) * 0.1,
    })
  }

  return [
    ...days,
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
}

describe('BalancePage', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-04-23T10:35:00+08:00'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseRouterKeys.mockReturnValue({
      keys: [
        {
          id: 1,
          name: 'main',
          token_preview: 'sk-main...',
          status: 1,
          is_active: true,
          billing_mode: 'limited',
          balance: 88,
          quota_mode: 2,
          quota_limit: 100,
          quota_used: 12,
          allowed_models: null,
          allow_ips: null,
          expires_at: null,
          last_used_at: null,
          created_at: '2026-04-01T00:00:00Z',
          updated_at: '2026-04-01T00:00:00Z',
        },
      ],
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })
    mockUseRouterBalance.mockReturnValue({
      balance: {
        balance: 120,
        frozen_amount: 20,
        used_amount: 50,
        available_balance: 100,
        total_requests: 0,
        total_tokens: 0,
        currency: 'CNY',
      },
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })
    mockUseRouterUsageSummary.mockReturnValue({
      summary: {
        total_requests: 320,
        success_requests: 300,
        prompt_tokens: 12000,
        completion_tokens: 5000,
        total_tokens: 17000,
        total_cost: 35,
        currency: 'CNY',
      },
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })
    mockUseRouterUsageEvents.mockReturnValue({
      events: [
        {
          id: 1,
          request_id: 'req-1',
          api_key_id: 1,
          model_name: 'gpt-4o',
          selected_model: null,
          provider_slug: null,
          prompt_tokens: 100,
          completion_tokens: 50,
          cached_tokens: 0,
          total_tokens: 150,
          cost: 2.5,
          status: 1,
          duration_ms: 200,
          is_stream: false,
          routing_tier: null,
          config_version: null,
          config_source: null,
          router_trace_id: null,
          error_code: null,
          error_msg: null,
          created_at: '2026-04-22T10:00:00Z',
        },
      ],
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })
    mockUseRouterUsageStats.mockReturnValue({
      stats: buildUsageStats(),
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })
  })

  it('replaces the lower dashboard with a token trend chart and range switcher', () => {
    render(<BalancePage />)

    expect(screen.getByRole('heading', { name: 'Token 使用趋势' })).toBeInTheDocument()
    expect(screen.queryByText('按已完成小时桶聚合，支持查看最近 24 小时、7 天与 30 天走势。')).not.toBeInTheDocument()
    expect(screen.queryByText('Key 余额分布')).not.toBeInTheDocument()
    expect(screen.queryByText('消费结构')).not.toBeInTheDocument()
    expect(screen.queryByText('按当前月真实 usage event 聚合')).not.toBeInTheDocument()
    expect(screen.queryByText('成功与失败请求总和')).not.toBeInTheDocument()
    expect(screen.queryByText('当前 Router 请求成功率')).not.toBeInTheDocument()
    expect(screen.queryByText('仍可用于调用的 API Key 数量')).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: '24h' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('token-trend-chart')).toBeInTheDocument()

    let latestOption = mockChartRender.mock.calls.at(-1)?.[0]?.option as {
      legend: { data: string[] }
      xAxis: { data: string[] }
      series: Array<{ data: number[] }>
    }

    expect(latestOption.legend.data).toEqual(['输入 Tokens', '输出 Tokens', '缓存 Tokens'])
    expect(latestOption.series).toHaveLength(3)
    expect(latestOption.xAxis.data).toHaveLength(24)

    fireEvent.click(screen.getByRole('button', { name: '7d' }))
    latestOption = mockChartRender.mock.calls.at(-1)?.[0]?.option
    expect(latestOption.xAxis.data).toHaveLength(7)

    fireEvent.click(screen.getByRole('button', { name: '30d' }))
    latestOption = mockChartRender.mock.calls.at(-1)?.[0]?.option
    expect(latestOption.xAxis.data).toHaveLength(30)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows loading and empty states inside the trend card', () => {
    mockUseRouterUsageStats.mockReturnValueOnce({
      stats: [],
      isLoading: true,
      isError: null,
      mutate: jest.fn(),
    })

    const { rerender } = render(<BalancePage />)

    expect(screen.getByText('正在加载 Token 趋势...')).toBeInTheDocument()
    expect(screen.queryByTestId('token-trend-chart')).not.toBeInTheDocument()

    mockUseRouterUsageStats.mockReturnValueOnce({
      stats: [],
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })

    rerender(<BalancePage />)

    expect(screen.getByText('所选时间范围暂无 Token 数据')).toBeInTheDocument()
    expect(screen.queryByTestId('token-trend-chart')).not.toBeInTheDocument()
  })

  it('shows an error message inside the trend card without affecting the hero cards', () => {
    mockUseRouterUsageStats.mockReturnValueOnce({
      stats: [],
      isLoading: false,
      isError: new Error('network error'),
      mutate: jest.fn(),
    })

    render(<BalancePage />)

    expect(screen.getByText('Token 趋势加载失败，请稍后重试。')).toBeInTheDocument()
    expect(screen.getByText('本月累计花费')).toBeInTheDocument()
    expect(screen.queryByTestId('token-trend-chart')).not.toBeInTheDocument()
  })
})
