import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import VoucherPage from './page'

const mockRedeemVoucher = jest.fn()
const mockUseVoucherRedemptions = jest.fn()
const mockGlobalMutate = jest.fn()
const mockHistoryMutate = jest.fn()

jest.mock('@/lib/api/router', () => ({
  redeemVoucher: (...args: unknown[]) => mockRedeemVoucher(...args),
}))

jest.mock('@/hooks/useRouterUsage', () => ({
  useVoucherRedemptions: (...args: unknown[]) => mockUseVoucherRedemptions(...args),
}))

jest.mock('swr', () => ({
  mutate: (...args: unknown[]) => mockGlobalMutate(...args),
}))

describe('VoucherPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseVoucherRedemptions.mockReturnValue({
      items: [],
      total: 0,
      isLoading: false,
      isError: null,
      mutate: mockHistoryMutate,
    })
  })

  it('renders masked voucher redemption history with converted amount', () => {
    mockUseVoucherRedemptions.mockReturnValue({
      items: [
        {
          id: 40,
          code_prefix: 'VC-A',
          code_suffix: '0001',
          amount: 8,
          status: 2,
          redeemed_at: '2026-04-22T10:00:00Z',
          created_at: '2026-04-21T10:00:00Z',
        },
      ],
      total: 1,
      isLoading: false,
      isError: null,
      mutate: mockHistoryMutate,
    })

    render(<VoucherPage />)

    expect(mockUseVoucherRedemptions).toHaveBeenCalledWith({ limit: 10, offset: 0 })
    expect(screen.getByRole('heading', { name: '兑换历史' })).toBeInTheDocument()
    expect(screen.getByText('VC-A...0001')).toBeInTheDocument()
    expect(screen.getByText('CNY 8.00')).toBeInTheDocument()
    expect(screen.getByText('已兑换')).toBeInTheDocument()
  })

  it('moves redemption history pagination in 10-item steps', async () => {
    mockUseVoucherRedemptions.mockImplementation((options?: { offset?: number }) => {
      const page = Math.floor((options?.offset ?? 0) / 10) + 1
      return {
        items: [
          {
            id: page,
            code_prefix: `VC-${page}`,
            code_suffix: '0001',
            amount: 8,
            status: 2,
            redeemed_at: '2026-04-22T10:00:00Z',
            created_at: '2026-04-21T10:00:00Z',
          },
        ],
        total: 21,
        isLoading: false,
        isError: null,
        mutate: mockHistoryMutate,
      }
    })

    render(<VoucherPage />)

    expect(mockUseVoucherRedemptions).toHaveBeenLastCalledWith({ limit: 10, offset: 0 })

    fireEvent.click(screen.getByRole('button', { name: '下一页' }))

    await waitFor(() =>
      expect(mockUseVoucherRedemptions).toHaveBeenLastCalledWith({ limit: 10, offset: 10 })
    )
  })

  it('shows an empty state when redemption history is empty', () => {
    render(<VoucherPage />)

    expect(screen.getByText('暂无兑换历史。')).toBeInTheDocument()
  })

  it('refreshes balance and redemption history after successful redeem', async () => {
    mockRedeemVoucher.mockResolvedValueOnce({
      data: {
        id: 41,
        amount: 8,
        status: 2,
        redeemed_at: '2026-04-22T10:00:00Z',
      },
    })

    render(<VoucherPage />)

    fireEvent.change(screen.getByPlaceholderText('请输入兑换码'), {
      target: { value: 'VC-ALPHA-0001' },
    })
    fireEvent.click(screen.getByRole('button', { name: '兑换' }))

    await waitFor(() => expect(mockRedeemVoucher).toHaveBeenCalledWith('VC-ALPHA-0001'))
    expect(mockGlobalMutate).toHaveBeenCalledWith('router-balance')
    expect(mockHistoryMutate).toHaveBeenCalled()
    expect(screen.getByText('兑换成功，已到账 CNY 8.00')).toBeInTheDocument()
  })
})
