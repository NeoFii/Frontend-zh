import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import {
  useRouterUsageAnalytics,
  useRouterUsageEvents,
  useRouterUsageLogs,
  useRouterUsageStats,
} from './useRouterUsage'

jest.mock('swr', () => jest.fn())

const mockedUseSWR = useSWR as jest.Mock

describe('useRouterUsageAnalytics', () => {
  beforeEach(() => {
    mockedUseSWR.mockReset()
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })
  })

  it('marks 404 analytics errors as unsupported and skips SWR retries', () => {
    const notFoundError = { response: { status: 404 } }
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: notFoundError,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useRouterUsageAnalytics({ range: '8h' }))
    const options = mockedUseSWR.mock.calls[0][2]
    const revalidate = jest.fn()

    options.onErrorRetry(notFoundError, ['router-usage-analytics', '8h'], {}, revalidate, { retryCount: 0 })

    expect(result.current.isUnsupported).toBe(true)
    expect(result.current.status).toBe(404)
    expect(revalidate).not.toHaveBeenCalled()
  })

  it('keeps previous analytics data while a new range loads', () => {
    renderHook(() => useRouterUsageAnalytics({ range: '8h' }))

    expect(mockedUseSWR.mock.calls[0][2]).toEqual(expect.objectContaining({ keepPreviousData: true }))
  })
})

describe('useRouterUsageStats', () => {
  beforeEach(() => {
    mockedUseSWR.mockReset()
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })
  })

  it('keeps previous fallback stats while a new window loads', () => {
    renderHook(() =>
      useRouterUsageStats({
        start: '2026-04-24T00:00:00Z',
        end: '2026-04-24T08:00:00Z',
      })
    )

    expect(mockedUseSWR.mock.calls[0][2]).toEqual(expect.objectContaining({ keepPreviousData: true }))
  })
})

describe('useRouterUsageEvents', () => {
  beforeEach(() => {
    mockedUseSWR.mockReset()
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })
  })

  it('keeps previous fallback events while a new window loads', () => {
    renderHook(() =>
      useRouterUsageEvents({
        start: '2026-04-24T00:00:00Z',
        end: '2026-04-24T08:00:00Z',
      })
    )

    expect(mockedUseSWR.mock.calls[0][2]).toEqual(expect.objectContaining({ keepPreviousData: true }))
  })
})

describe('useRouterUsageLogs', () => {
  beforeEach(() => {
    mockedUseSWR.mockReset()
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })
  })

  it('keeps previous log rows while a new filter loads', () => {
    renderHook(() =>
      useRouterUsageLogs({
        page: 1,
        pageSize: 20,
        start: '2026-04-24T00:00:00Z',
        end: '2026-04-24T08:00:00Z',
      })
    )

    expect(mockedUseSWR.mock.calls[0][2]).toEqual(expect.objectContaining({ keepPreviousData: true }))
  })
})
