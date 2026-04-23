import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import { useRouterUsageAnalytics } from './useRouterUsage'

jest.mock('swr', () => jest.fn())

const mockedUseSWR = useSWR as jest.Mock

describe('useRouterUsageAnalytics', () => {
  beforeEach(() => {
    mockedUseSWR.mockReset()
  })

  it('marks 404 analytics errors as unsupported and skips SWR retries', () => {
    const notFoundError = { response: { status: 404 } }
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: notFoundError,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useRouterUsageAnalytics('8h'))
    const options = mockedUseSWR.mock.calls[0][2]
    const revalidate = jest.fn()

    options.onErrorRetry(notFoundError, ['router-usage-analytics', '8h'], {}, revalidate, { retryCount: 0 })

    expect(result.current.isUnsupported).toBe(true)
    expect(result.current.status).toBe(404)
    expect(revalidate).not.toHaveBeenCalled()
  })
})
