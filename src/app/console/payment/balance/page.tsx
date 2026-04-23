'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useRouter } from 'next/navigation'
import { useRouterKeys } from '@/hooks/useRouterKeys'
import {
  useRouterBalance,
  useRouterUsageEvents,
  useRouterUsageStats,
  useRouterUsageSummary,
} from '@/hooks/useRouterUsage'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'
import {
  buildBalanceTokenTrendViewModel,
  calculateMonthlySpend,
  calculateSuccessRate,
  countActiveKeys,
  extractCurrency,
  formatCompactNumber,
  formatCurrency,
  formatTokenAxisValue,
  getBalanceTokenTrendQueryWindow,
  summarizeUsageEvents,
  type BalanceTokenTrendRange,
  usageSummaryToAggregate,
} from '@/lib/router-analytics'

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-950"></div>
    </div>
  ),
})

echarts.use([LineChart, CanvasRenderer, GridComponent, LegendComponent, TooltipComponent])

const RANGE_OPTIONS: BalanceTokenTrendRange[] = ['24h', '7d', '30d']
const TREND_COLORS = ['#2563eb', '#f97316', '#10b981']

export default function BalancePage() {
  const router = useRouter()
  const [trendRange, setTrendRange] = useState<BalanceTokenTrendRange>('24h')
  const { keys, isLoading: keysLoading } = useRouterKeys()
  const { balance, isLoading: balanceLoading } = useRouterBalance()
  const { summary, isLoading: summaryLoading } = useRouterUsageSummary()
  const { events, isLoading: eventsLoading } = useRouterUsageEvents({ limit: 100, maxPages: 10 })

  const trendWindow = useMemo(() => getBalanceTokenTrendQueryWindow(trendRange), [trendRange])
  const { stats, isLoading: statsLoading, isError: statsError } = useRouterUsageStats(trendWindow)

  const currency = extractCurrency(summary)
  const aggregate = events.length > 0 ? summarizeUsageEvents(events, currency) : usageSummaryToAggregate(summary)
  const monthlySpend = calculateMonthlySpend(events)
  const successRate = calculateSuccessRate(aggregate)
  const activeKeys = countActiveKeys(keys)
  const loading = keysLoading || balanceLoading || summaryLoading || eventsLoading

  const availableBalance = balance?.available_balance ?? 0
  const totalBalance = balance?.balance ?? 0
  const frozenAmount = balance?.frozen_amount ?? 0
  const balanceCurrency = balance?.currency ?? currency

  const trendViewModel = useMemo(() => buildBalanceTokenTrendViewModel(stats, trendRange), [stats, trendRange])

  const trendOption = useMemo(
    () => ({
      color: TREND_COLORS,
      tooltip: {
        trigger: 'axis',
        valueFormatter: (value: number) => `${value.toLocaleString('zh-CN')} Tokens`,
      },
      legend: {
        data: trendViewModel.legend,
        top: 0,
        textStyle: { color: '#64748b', fontSize: 12 },
      },
      grid: {
        left: 12,
        right: 12,
        top: 56,
        bottom: 12,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: trendViewModel.xAxis,
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisTick: { show: false },
        axisLabel: { color: '#64748b' },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#64748b',
          formatter: (value: number) => formatTokenAxisValue(value),
        },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
      },
      series: trendViewModel.series.map((series, index) => ({
        ...series,
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        lineStyle: {
          width: 3,
          color: TREND_COLORS[index],
        },
        itemStyle: {
          color: TREND_COLORS[index],
        },
        emphasis: {
          focus: 'series',
        },
      })),
    }),
    [trendViewModel]
  )

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="rounded-2xl bg-[#f7f7f8] px-8 py-7 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.2)] ring-1 ring-inset ring-gray-100">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <ConsolePageHeader
              badge="BALANCE"
              title="账户余额"
              description={`总余额 ${loading ? '...' : formatCurrency(totalBalance, balanceCurrency)}，冻结 ${loading ? '...' : formatCurrency(frozenAmount, balanceCurrency)}`}
            />
            <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-950">
              {loading ? '...' : formatCurrency(availableBalance, balanceCurrency)}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/console/payment/billing-history')}
                className="rounded-full bg-gray-950 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                账单历史
              </button>
              <button
                onClick={() => router.push('/console/payment/recharge')}
                className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                充值记录
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">本月累计花费</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">
                {loading ? '...' : formatCurrency(monthlySpend, currency)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">总请求数</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">
                {loading ? '...' : formatCompactNumber(aggregate.totalRequests)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">成功率</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">
                {loading ? '...' : `${successRate.toFixed(1)}%`}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">启用中的 Key</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">{loading ? '...' : String(activeKeys)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg text-gray-900">Token 使用趋势</h3>
          </div>

          <div className="inline-flex rounded-full bg-gray-100 p-1">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={trendRange === option}
                onClick={() => setTrendRange(option)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  trendRange === option
                    ? 'bg-white text-gray-950 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.75)]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 h-[360px]">
          {statsLoading ? (
            <div className="flex h-full flex-col justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6">
              <p className="text-sm text-gray-500">正在加载 Token 趋势...</p>
              <div className="space-y-3">
                <div className="h-3 w-full animate-pulse rounded-full bg-gray-200" />
                <div className="h-3 w-5/6 animate-pulse rounded-full bg-gray-200" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-gray-200" />
              </div>
            </div>
          ) : statsError ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/60 px-6 text-center text-sm text-red-600">
              Token 趋势加载失败，请稍后重试。
            </div>
          ) : !trendViewModel.hasData ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center text-sm text-gray-500">
              所选时间范围暂无 Token 数据
            </div>
          ) : (
            <ReactECharts option={trendOption} style={{ height: '100%', width: '100%' }} />
          )}
        </div>
      </section>
    </div>
  )
}
