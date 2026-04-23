import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import BillingHistoryPage from './page'

const mockUseRouterBillingLedger = jest.fn()

jest.mock('@/hooks/useRouterUsage', () => ({
  useRouterBillingLedger: (...args: unknown[]) => mockUseRouterBillingLedger(...args),
}))

function ledgerItem(type: number, overrides = {}) {
  return {
    id: type,
    type,
    direction: type === 2 ? 'debit' : 'credit',
    amount: type === 2 ? -4.56 : 8,
    balance_before: 10,
    balance_after: type === 2 ? 5.44 : 18,
    description: null,
    ref_type: type === 7 ? 'voucher_code' : 'topup_order',
    ref_id: type === 7 ? '10' : 'order-1',
    remark: null,
    created_at: '2026-04-22T10:00:00Z',
    ...overrides,
  }
}

describe('BillingHistoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouterBillingLedger.mockImplementation((options?: { type?: number }) => ({
      items: [ledgerItem(options?.type ?? 1)],
      total: 75,
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    }))
  })

  it('requests server-side type filtering and resets to the first page on tab change', async () => {
    render(<BillingHistoryPage />)

    expect(mockUseRouterBillingLedger).toHaveBeenLastCalledWith({
      limit: 10,
      offset: 0,
      type: undefined,
    })

    fireEvent.click(screen.getByRole('button', { name: '下一页' }))
    await waitFor(() =>
      expect(mockUseRouterBillingLedger).toHaveBeenLastCalledWith({
        limit: 10,
        offset: 10,
        type: undefined,
      })
    )

    fireEvent.click(screen.getByRole('button', { name: '代金券' }))
    await waitFor(() =>
      expect(mockUseRouterBillingLedger).toHaveBeenLastCalledWith({
        limit: 10,
        offset: 0,
        type: 7,
      })
    )
  })

  it('distinguishes empty ledger from empty current type', async () => {
    mockUseRouterBillingLedger.mockImplementation((options?: { type?: number }) => ({
      items: options?.type === 7 ? [] : [ledgerItem(1)],
      total: options?.type === 7 ? 0 : 1,
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    }))

    render(<BillingHistoryPage />)

    fireEvent.click(screen.getByRole('button', { name: '代金券' }))

    await waitFor(() => expect(screen.getByText('当前类型下暂无记录。')).toBeInTheDocument())
    expect(screen.queryByText('暂无账单流水。')).not.toBeInTheDocument()
  })

  it('hides voucher remarks and internal references from billing rows', async () => {
    mockUseRouterBillingLedger.mockImplementation((options?: { type?: number }) => ({
      items: [
        ledgerItem(options?.type ?? 1, {
          type: options?.type ?? 1,
          description: options?.type === 7 ? 'frontend voucher page test: 100 CNY' : null,
          ref_type: options?.type === 7 ? 'voucher_code' : 'topup_order',
          ref_id: options?.type === 7 ? '1' : 'order-1',
          amount: 100,
          balance_after: 100,
        }),
      ],
      total: 1,
      isLoading: false,
      isError: null,
      mutate: jest.fn(),
    }))

    render(<BillingHistoryPage />)

    fireEvent.click(screen.getByRole('button', { name: '代金券' }))

    await waitFor(() => expect(screen.getByText('代金券兑换')).toBeInTheDocument())
    expect(screen.queryByText('frontend voucher page test: 100 CNY')).not.toBeInTheDocument()
    expect(screen.queryByText('voucher_code')).not.toBeInTheDocument()
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })
})
