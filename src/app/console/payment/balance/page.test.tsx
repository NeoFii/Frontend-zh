import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import BalancePage from './page'
import { buildUsageRecordTimeWindow } from '@/lib/usage-record-analytics'

const mockPush = jest.fn()
const mockUseRouterKeys = jest.fn()
const mockUseRouterBalance = jest.fn()
const mockUseRouterUsageSummary = jest.fn()
const mockUseRouterUsageEvents = jest.fn()
const mockUseRouterUsageLogs = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('@/hooks/useRouterKeys', () => ({
  useRouterKeys: () => mockUseRouterKeys(),
}))

jest.mock('@/hooks/useRouterUsage', () => ({
  useRouterBalance: () => mockUseRouterBalance(),
  useRouterUsageSummary: () => mockUseRouterUsageSummary(),
  useRouterUsageEvents: () => mockUseRouterUsageEvents(),
  useRouterUsageLogs: (...args: unknown[]) => mockUseRouterUsageLogs(...args),
}))

function createLogItem(index: number) {
  return {
    id: index,
    request_id: `req-${index}`,
    api_key_id: index % 2 === 0 ? 2 : 1,
    effective_model: index % 3 === 0 ? 'gpt-4.1-mini' : 'gpt-4.1-mini-2026-04-14',
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
    created_at: `2026-04-22T0${index % 9}:00:00Z`,
  }
}

function chooseSelectOption(name: string, optionLabel: string) {
  const trigger = screen.getByRole('combobox', { name })
  fireEvent.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  fireEvent.click(screen.getByRole('option', { name: optionLabel }))
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
    mockUseRouterUsageLogs.mockImplementation((filter?: { page?: number }) => {
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

  it('renders the request details table with filters and pagination', () => {
    render(<BalancePage />)

    const defaultWindow = buildUsageRecordTimeWindow('24h', new Date('2026-04-23T10:35:00+08:00'))

    expect(screen.getByRole('heading', { name: '请求明细' })).toBeInTheDocument()
    expect(screen.queryByText('Token 使用趋势')).not.toBeInTheDocument()

    expect(screen.getByLabelText('开始时间')).toBeInTheDocument()
    expect(screen.getByLabelText('结束时间')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: '调用模型' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'KEY' })).toBeInTheDocument()

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
    expect(screen.getAllByText('共 25 条').length).toBeGreaterThanOrEqual(1)
  })

  it('shows loading state for the request details table', () => {
    mockUseRouterUsageLogs.mockReturnValueOnce({
      items: [],
      total: 0,
      isLoading: true,
      isError: null,
      mutate: jest.fn(),
    })

    render(<BalancePage />)

    expect(screen.getByRole('heading', { name: '请求明细' })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByText('本月累计花费')).toBeInTheDocument()
  })

  it('shows an error banner when request details fail to load', () => {
    mockUseRouterUsageLogs.mockReturnValueOnce({
      items: [],
      total: 0,
      isLoading: false,
      isError: new Error('network error'),
      mutate: jest.fn(),
    })

    render(<BalancePage />)

    expect(screen.getByText('请求明细加载失败。')).toBeInTheDocument()
    expect(screen.getByText('本月累计花费')).toBeInTheDocument()
  })

  it('resets pagination to page 1 when a filter changes', async () => {
    render(<BalancePage />)

    fireEvent.click(screen.getByRole('button', { name: '下一页' }))
    await waitFor(() =>
      expect(mockUseRouterUsageLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 })
      )
    )

    chooseSelectOption('KEY', 'main (sk-main...)')

    await waitFor(() =>
      expect(mockUseRouterUsageLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1, keyId: 1 })
      )
    )
  })
})
