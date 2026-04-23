import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import UsageRecordPage from './page'
import { buildUsageRecordAnalyticsWindow, buildUsageRecordTimeWindow } from '@/lib/usage-record-analytics'

const mockChartRender = jest.fn()
const mockUseRouterBalance = jest.fn()
const mockUseRouterUsageAnalytics = jest.fn()
const mockUseRouterUsageEvents = jest.fn()
const mockUseRouterUsageLogs = jest.fn()
const mockUseRouterUsageStats = jest.fn()
const mockUseRouterKeys = jest.fn()

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
  useRouterUsageAnalytics: (...args: unknown[]) => mockUseRouterUsageAnalytics(...args),
  useRouterUsageEvents: (...args: unknown[]) => mockUseRouterUsageEvents(...args),
  useRouterUsageLogs: (...args: unknown[]) => mockUseRouterUsageLogs(...args),
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

function createLogItem(index: number) {
  return {
    id: index,
    request_id: `req-${index}`,
    api_key_id: index % 2 === 0 ? 2 : 1,
    model_name: 'gpt-4.1-mini',
    selected_model: index % 3 === 0 ? null : 'gpt-4.1-mini-2026-04-14',
    provider_slug: 'openai',
    prompt_tokens: 100 + index,
    completion_tokens: 50 + index,
    cached_tokens: 0,
    total_tokens: 150 + index,
    cost: 0.2 + index * 0.01,
    status: 1,
    duration_ms: 200 + index,
    is_stream: false,
    routing_tier: null,
    config_version: null,
    config_source: null,
    router_trace_id: null,
    error_code: null,
    error_msg: null,
    created_at: `2026-04-24T0${index % 9}:00:00Z`,
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

    mockUseRouterKeys.mockReturnValue({
      keys: [
        {
          id: 1,
          name: '主 Key',
          token_preview: 'sk-main...',
          status: 1,
          is_active: true,
          billing_mode: 'limited',
          balance: 50,
          quota_mode: 2,
          quota_limit: 100,
          quota_used: 50,
          allowed_models: null,
          allow_ips: null,
          expires_at: null,
          last_used_at: null,
          created_at: '2026-04-01T00:00:00Z',
          updated_at: '2026-04-01T00:00:00Z',
        },
        {
          id: 2,
          name: '批处理',
          token_preview: 'sk-batch...',
          status: 1,
          is_active: true,
          billing_mode: 'limited',
          balance: 20,
          quota_mode: 2,
          quota_limit: 40,
          quota_used: 20,
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

    mockUseRouterUsageLogs.mockImplementation((filter?: { page?: number; effectiveModel?: string; keyId?: number }) => {
      const page = filter?.page ?? 1
      const startIndex = (page - 1) * 20
      const items = Array.from({ length: page === 2 ? 5 : 20 }, (_, index) => createLogItem(startIndex + index + 1))

      return {
        items,
        total: 25,
        isLoading: false,
        isError: null,
        mutate: jest.fn(),
      }
    })
  })

  it('defaults to the 8h range and renders four summary cards, three analytics panels, and a 20-row detail page', () => {
    render(<UsageRecordPage />)

    const defaultWindow = buildUsageRecordTimeWindow('8h', new Date('2026-04-24T16:45:00+08:00'))

    expect(screen.getByRole('button', { name: '8h' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('当前余额')).toBeInTheDocument()
    expect(screen.getByText('使用统计')).toBeInTheDocument()
    expect(screen.getByText('花费')).toBeInTheDocument()
    expect(screen.getByText('成功率')).toBeInTheDocument()
    expect(screen.getByText('费用分布')).toBeInTheDocument()
    expect(screen.getByText('请求占比')).toBeInTheDocument()
    expect(screen.getByText('请求排行')).toBeInTheDocument()
    expect(mockUseRouterUsageAnalytics).toHaveBeenLastCalledWith('8h')
    expect(mockUseRouterUsageLogs).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: 20,
      start: defaultWindow.start,
      end: defaultWindow.end,
      effectiveModel: undefined,
      keyId: undefined,
    })

    const rows = within(screen.getByRole('table')).getAllByRole('row')
    expect(rows).toHaveLength(21)
    expect(screen.getByText('共 25 条')).toBeInTheDocument()
  })

  it('refreshes analytics and resets the detail time window when the global range changes', async () => {
    render(<UsageRecordPage />)

    fireEvent.click(screen.getByRole('button', { name: '下一页' }))
    await waitFor(() =>
      expect(mockUseRouterUsageLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 2,
        })
      )
    )

    fireEvent.change(screen.getByLabelText('开始时间'), {
      target: { value: '2026-04-24T09:00' },
    })

    fireEvent.click(screen.getByRole('button', { name: '24h' }))

    const nextWindow = buildUsageRecordTimeWindow('24h', new Date('2026-04-24T16:45:00+08:00'))

    await waitFor(() => expect(mockUseRouterUsageAnalytics).toHaveBeenLastCalledWith('24h'))
    await waitFor(() =>
      expect(mockUseRouterUsageLogs).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: 20,
        start: nextWindow.start,
        end: nextWindow.end,
        effectiveModel: undefined,
        keyId: undefined,
      })
    )

    expect(screen.getByLabelText('开始时间')).toHaveValue(nextWindow.startInput)
    expect(screen.getByLabelText('结束时间')).toHaveValue(nextWindow.endInput)
  })

  it('resets pagination to page 1 when the actual-model or key filter changes', async () => {
    render(<UsageRecordPage />)

    fireEvent.click(screen.getByRole('button', { name: '下一页' }))
    await waitFor(() =>
      expect(mockUseRouterUsageLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 2,
        })
      )
    )

    fireEvent.change(screen.getByLabelText('实际模型'), {
      target: { value: 'gpt-4.1-mini-2026-04-14' },
    })

    await waitFor(() =>
      expect(mockUseRouterUsageLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 1,
          effectiveModel: 'gpt-4.1-mini-2026-04-14',
        })
      )
    )

    fireEvent.click(screen.getByRole('button', { name: '下一页' }))
    await waitFor(() =>
      expect(mockUseRouterUsageLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 2,
          effectiveModel: 'gpt-4.1-mini-2026-04-14',
        })
      )
    )

    fireEvent.change(screen.getByLabelText('KEY'), {
      target: { value: '2' },
    })

    await waitFor(() =>
      expect(mockUseRouterUsageLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 1,
          effectiveModel: 'gpt-4.1-mini-2026-04-14',
          keyId: 2,
        })
      )
    )
  })

  it('keeps the full page layout and uses fallback analytics when the analytics endpoint returns 404', () => {
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
          model_name: 'auto',
          selected_model: 'gpt-4.1-mini-2026-04-14',
          provider_slug: 'openai',
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
          model_name: 'claude-3-7-sonnet-2026-02-19',
          selected_model: null,
          provider_slug: 'anthropic',
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
      ],
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })

    render(<UsageRecordPage />)

    const analyticsWindow = buildUsageRecordAnalyticsWindow('8h', new Date('2026-04-24T16:45:00+08:00'))

    expect(screen.queryByText('使用记录加载失败。')).not.toBeInTheDocument()
    expect(screen.getByText('当前余额')).toBeInTheDocument()
    expect(screen.getByText('使用统计')).toBeInTheDocument()
    expect(screen.getByText('花费')).toBeInTheDocument()
    expect(screen.getByText('成功率')).toBeInTheDocument()
    expect(screen.getByText('费用分布')).toBeInTheDocument()
    expect(screen.getByText('请求占比')).toBeInTheDocument()
    expect(screen.getByText('请求排行')).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(mockUseRouterUsageStats).toHaveBeenLastCalledWith({
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
    expect(screen.getByRole('combobox', { name: '实际模型' })).toHaveTextContent('gpt-4.1-mini-2026-04-14')
    expect(screen.getAllByTestId('usage-chart')).toHaveLength(2)
  })

  it('renders empty analytics and detail states without breaking the layout', () => {
    mockUseRouterUsageAnalytics.mockReturnValueOnce({
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
    mockUseRouterUsageLogs.mockReturnValueOnce({
      items: [],
      total: 0,
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    })

    render(<UsageRecordPage />)

    expect(screen.getByText('所选时间范围暂无模型花费分布')).toBeInTheDocument()
    expect(screen.getByText('当前筛选条件下没有请求记录')).toBeInTheDocument()
  })
})
