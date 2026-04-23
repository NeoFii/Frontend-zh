import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import RechargePage from './page'

const mockFetchTopupOrders = jest.fn()

jest.mock('@/lib/api/router', () => ({
  fetchTopupOrders: (...args: unknown[]) => mockFetchTopupOrders(...args),
}))

function buildOrder(page: number) {
  return {
    id: page,
    order_no: `TP-${page}`,
    amount: 8,
    status: 2,
    payment_channel: 'alipay',
    payment_no: `pay-${page}`,
    paid_at: '2026-04-22T10:00:00Z',
    remark: null,
    created_at: '2026-04-22T09:50:00Z',
    updated_at: '2026-04-22T10:00:00Z',
  }
}

describe('RechargePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetchTopupOrders.mockImplementation((params?: { page?: number; page_size?: number }) =>
      Promise.resolve({
        data: {
          items: [buildOrder(params?.page ?? 1)],
          total: 16,
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
        },
      })
    )
  })

  it('requests topup orders with a 10-item page size and paginates forward', async () => {
    render(<RechargePage />)

    await waitFor(() =>
      expect(mockFetchTopupOrders).toHaveBeenCalledWith({ page: 1, page_size: 10 })
    )
    expect(screen.getByText('TP-1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '下一页' }))

    await waitFor(() =>
      expect(mockFetchTopupOrders).toHaveBeenLastCalledWith({ page: 2, page_size: 10 })
    )
    expect(screen.getByText('TP-2')).toBeInTheDocument()
  })

  it('hides pagination when there are 10 or fewer recharge records', async () => {
    mockFetchTopupOrders.mockResolvedValueOnce({
      data: {
        items: [buildOrder(1)],
        total: 10,
        page: 1,
        page_size: 10,
      },
    })

    render(<RechargePage />)

    await waitFor(() =>
      expect(mockFetchTopupOrders).toHaveBeenCalledWith({ page: 1, page_size: 10 })
    )
    expect(screen.queryByRole('button', { name: '下一页' })).not.toBeInTheDocument()
  })
})
