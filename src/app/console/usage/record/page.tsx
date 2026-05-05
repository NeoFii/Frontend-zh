'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import type { RouterUsageAnalyticsRange } from '@/lib/api/router'
import {
  useRouterBalance,
  useRouterUsageAnalytics,
  useRouterUsageEvents,
  useRouterUsageStats,
} from '@/hooks/useRouterUsage'
import { useUser } from '@/hooks/useUser'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'
import ErrorBanner from '@/components/ui/ErrorBanner'
import {
  buildBalanceTokenTrendViewModel,
  formatCompactNumber,
  formatCurrency,
  formatCurrencyDetail,
  formatTokenAxisValue,
  getBalanceTokenTrendQueryWindow,
  type BalanceTokenTrendRange,
} from '@/lib/router-analytics'
import {
  buildUsageRecordAnalyticsWindow,
  buildUsageRecordAnalyticsViewModel,
  buildUsageRecordFallbackAnalytics,
  buildUsageRecordFallbackOverview,
  normalizeSuccessRateToPercent,
  USAGE_RECORD_RANGES,
} from '@/lib/usage-record-analytics'

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-950"></div>
    </div>
  ),
})

echarts.use([BarChart, LineChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

const TREND_RANGE_OPTIONS: BalanceTokenTrendRange[] = ['24h', '7d', '30d']
const TREND_COLORS = ['#2563eb', '#f97316', '#10b981']

function SummaryValueLoading() {
  return <div className="mt-4 h-8 w-24 animate-pulse rounded-lg bg-gray-100" />
}

function SummaryCard(props: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
      <p className="text-sm text-gray-500">{props.label}</p>
      {typeof props.value === 'string' ? (
        <p className="mt-3 text-3xl tracking-tight text-gray-950">{props.value}</p>
      ) : (
        props.value
      )}
    </div>
  )
}

function PanelShell(props: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-5 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
      <div className="mb-4">
        <h3 className="text-lg text-gray-950">{props.title}</h3>
      </div>
      {props.children}
    </section>
  )
}

const EMPTY_BAR_LABELS = ['', '', '', '', '', '']

function EmptyRankingState() {
  return (
    <div data-testid="usage-ranking-empty" className="space-y-3" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="h-7 w-7 rounded-full bg-white" />
            <span className="h-3 w-3 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <span className="block h-3 w-28 rounded-full bg-gray-200" />
              <span className="block h-2.5 w-16 rounded-full bg-gray-100" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="block h-3 w-14 rounded-full bg-gray-200" />
            <span className="block h-2.5 w-10 rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

function PanelLoadingState() {
  return <div className="h-[320px] animate-pulse rounded-lg bg-gray-100" />
}

export default function UsageRecordPage() {
  const [range, setRange] = useState<RouterUsageAnalyticsRange>('8h')
  const [rightPanelTab, setRightPanelTab] = useState<'donut' | 'ranking'>('donut')
  const [trendRange, setTrendRange] = useState<BalanceTokenTrendRange>('24h')
  const analyticsWindow = useMemo(() => buildUsageRecordAnalyticsWindow(range), [range])
  const trendWindow = useMemo(() => getBalanceTokenTrendQueryWindow(trendRange), [trendRange])

  // RPM/TPM 实时指标。SWR 在路由切换时自动刷新；TPM 是 60s 滑动窗口，
  // 当前页面停留时不强制 polling，避免无谓的请求。
  const { user } = useUser()
  const defaultRpm = user?.default_rpm ?? 20
  const rpmDisplay = user?.rpm_limit != null ? String(user.rpm_limit) : `${defaultRpm}`
  const rpmIsDefault = user?.rpm_limit == null
  const tpmDisplay = (user?.current_tpm ?? 0).toLocaleString()

  const { balance, isLoading: balanceLoading, isError: balanceError, mutate: mutateBalance } = useRouterBalance()
  const {
    analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
    isUnsupported: analyticsUnsupported,
    mutate: mutateAnalytics,
  } = useRouterUsageAnalytics(range)
  const fallbackEnabled = analyticsUnsupported || Boolean(analyticsError)
  const {
    stats: fallbackStats,
    mutate: mutateFallbackStats,
  } = useRouterUsageStats(
    fallbackEnabled
      ? {
          start: analyticsWindow.start,
          end: analyticsWindow.end,
        }
      : undefined
  )
  const {
    events: fallbackEvents,
    isLoading: fallbackEventsLoading,
    isError: fallbackEventsError,
    mutate: mutateFallbackEvents,
  } = useRouterUsageEvents({
    enabled: fallbackEnabled,
    start: analyticsWindow.start,
    end: analyticsWindow.end,
    limit: 100,
    maxPages: 20,
  })
  const {
    stats: trendStats,
    isLoading: trendStatsLoading,
    isError: trendStatsError,
  } = useRouterUsageStats(trendWindow)

  const fallbackOverview = useMemo(
    () => buildUsageRecordFallbackOverview(fallbackStats, fallbackEvents),
    [fallbackEvents, fallbackStats]
  )
  const fallbackInitialLoading = fallbackEventsLoading && fallbackStats.length === 0 && fallbackEvents.length === 0
  const fallbackAnalytics = useMemo(() => {
    if (!fallbackEnabled || fallbackEventsError) {
      return null
    }

    if (fallbackInitialLoading) {
      return null
    }

    return buildUsageRecordFallbackAnalytics({
      range,
      stats: fallbackStats,
      events: fallbackEvents,
      currency: balance?.currency || 'CNY',
    })
  }, [balance?.currency, fallbackEnabled, fallbackEvents, fallbackEventsError, fallbackInitialLoading, fallbackStats, range])
  const analyticsData = analytics ?? fallbackAnalytics
  const analyticsViewModel = useMemo(() => buildUsageRecordAnalyticsViewModel(analyticsData), [analyticsData])
  const currency = analyticsData?.currency || balance?.currency || 'CNY'
  const summaryOverview = analyticsData?.overview ?? fallbackOverview
  const successRate = normalizeSuccessRateToPercent(summaryOverview.success_rate)
  const analyticsAreaLoading = !analyticsData && (analyticsLoading || (fallbackEnabled && fallbackInitialLoading))
  const analyticsAreaError = !analyticsData && !analyticsAreaLoading && Boolean(analyticsError) && Boolean(fallbackEventsError)

  const trendViewModel = useMemo(() => buildBalanceTokenTrendViewModel(trendStats, trendRange), [trendStats, trendRange])
  const trendHasData = trendViewModel.hasData

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
          width: trendHasData ? 3 : 2,
          color: trendHasData ? TREND_COLORS[index] : '#cbd5e1',
        },
        itemStyle: {
          color: trendHasData ? TREND_COLORS[index] : '#cbd5e1',
        },
        emphasis: {
          focus: 'series',
        },
      })),
    }),
    [trendHasData, trendViewModel]
  )

  const stackedBarOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (
          params: Array<{
            axisValueLabel: string
            seriesName: string
            value: number
            marker?: string
            color?: string
          }>
        ) => {
          const header = params[0]?.axisValueLabel ?? ''
          const nonZero = params.filter((item) => item.value > 0)
          const rows = nonZero
            .map(
              (item) =>
                `${item.marker ?? ''}${item.seriesName}：${formatCurrencyDetail(item.value, currency)}`
            )
            .join('<br/>')
          if (!rows) {
            return `${header}<br/>暂无花费`
          }
          const total = nonZero.reduce((sum, item) => sum + item.value, 0)
          return `${header}<br/>${rows}<br/><span style="display:inline-block;width:10px;"></span>总计：${formatCurrencyDetail(total, currency)}`
        },
      },
      legend: {
        type: 'scroll',
        top: 0,
        left: 'center',
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 12,
        pageIconColor: '#64748b',
        pageTextStyle: { color: '#64748b', fontSize: 11 },
        data: analyticsViewModel.stackedBar.series.map((item) => item.model),
        textStyle: { color: '#475569', fontSize: 12 },
      },
      grid: {
        left: 16,
        right: 16,
        top: 56,
        bottom: 16,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: analyticsViewModel.stackedBar.labels,
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisTick: { show: false },
        axisLabel: { color: '#475569', fontSize: 12 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: true, lineStyle: { color: '#cbd5e1' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#475569',
          fontSize: 11,
          formatter: (value: number) => value.toFixed(6),
        },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
      },
      series: analyticsViewModel.stackedBar.series.map((item) => ({
        name: item.model,
        type: 'bar',
        stack: 'cost',
        barMaxWidth: 48,
        emphasis: { focus: 'series' },
        itemStyle: { color: item.color },
        data: item.data.map((value) => Number(value.toFixed(6))),
      })),
    }),
    [analyticsViewModel.stackedBar.labels, analyticsViewModel.stackedBar.series, currency]
  )

  const emptyStackedBarOption = useMemo(() => {
    const labels =
      analyticsViewModel.stackedBar.labels.length > 0 ? analyticsViewModel.stackedBar.labels : EMPTY_BAR_LABELS

    return {
      tooltip: { show: false },
      legend: {
        top: 0,
        left: 'center',
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: '#94a3b8', fontSize: 12 },
        data: ['暂无数据'],
      },
      grid: {
        left: 16,
        right: 16,
        top: 56,
        bottom: 16,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 12 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: true, lineStyle: { color: '#cbd5e1' } },
        axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 11, formatter: (value: number) => value.toFixed(6) },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
      },
      series: [
        {
          name: '暂无数据',
          type: 'bar',
          silent: true,
          barMaxWidth: 24,
          itemStyle: { color: '#e5e7eb' },
          data: labels.map(() => 0),
        },
      ],
    }
  }, [analyticsViewModel.stackedBar.labels])

  const donutOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: (params: { name: string; data: { requestCount: number; requestSharePercent: number } }) =>
          `${params.name}<br/>${formatCompactNumber(params.data.requestCount)} 次请求 (${params.data.requestSharePercent.toFixed(1)}%)`,
      },
      series: [
        {
          type: 'pie',
          radius: ['46%', '64%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b|{b}}\n{c|{d}%}',
            rich: {
              b: { fontSize: 12, color: '#334155', lineHeight: 18 },
              c: { fontSize: 11, color: '#64748b', lineHeight: 16 },
            },
          },
          labelLine: {
            show: true,
            length: 8,
            length2: 8,
            smooth: false,
          },
          labelLayout: { hideOverlap: true },
          data: analyticsViewModel.donut.map((item) => ({
            value: item.requestCount,
            name: item.model,
            requestCount: item.requestCount,
            requestSharePercent: item.requestSharePercent,
            itemStyle: { color: item.color },
          })),
        },
      ],
    }),
    [analyticsViewModel.donut]
  )

  const emptyDonutOption = useMemo(
    () => ({
      tooltip: { show: false },
      series: [
        {
          type: 'pie',
          radius: ['46%', '64%'],
          center: ['50%', '50%'],
          silent: true,
          label: { show: false },
          emphasis: { disabled: true },
          data: [
            {
              value: 1,
              name: '',
              itemStyle: { color: '#e5e7eb' },
            },
          ],
        },
      ],
    }),
    []
  )

  const summaryLoading = analyticsAreaLoading
  const summaryError = analyticsAreaError

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_32%),linear-gradient(145deg,#f8fafc_0%,#ffffff_62%,#eff6ff_100%)] p-7 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <ConsolePageHeader
              badge="USAGE RECORD"
              title="使用记录"
              description="同一时间范围统一驱动总览与模型分析。"
            />
            <div className="mt-5 inline-flex rounded-full bg-gray-100 p-1">
              {USAGE_RECORD_RANGES.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={range === option}
                  onClick={() => setRange(option)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    range === option
                      ? 'bg-white text-gray-950 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.75)]'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:min-w-[280px]">
            <div className="rounded-lg border border-white/60 bg-white/80 px-4 py-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.4)] backdrop-blur">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">RPM</p>
              <p className="mt-1.5 text-2xl tracking-tight text-gray-950">
                {rpmDisplay}
                {rpmIsDefault && (
                  <span className="ml-1.5 align-middle text-[10px] font-medium text-gray-400">默认</span>
                )}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">每分钟请求上限</p>
            </div>
            <div className="rounded-lg border border-white/60 bg-white/80 px-4 py-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.4)] backdrop-blur">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">TPM</p>
              <p className="mt-1.5 text-2xl tracking-tight text-gray-950">{tpmDisplay}</p>
              <p className="mt-1 text-[11px] text-gray-500">最近 60 秒 tokens/min</p>
            </div>
          </div>
        </div>
      </section>

      {balanceError && (
        <ErrorBanner
          message="基础数据加载失败。"
          onRetry={() => {
            void mutateBalance()
            void mutateAnalytics()
          }}
        />
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="当前余额"
          value={
            balanceLoading && !balance ? (
              <SummaryValueLoading />
            ) : balanceError && !balance ? (
              '加载失败'
            ) : (
              formatCurrency(balance?.available_balance ?? 0, currency)
            )
          }
        />
        <SummaryCard
          label="使用统计"
          value={
            summaryLoading ? (
              <SummaryValueLoading />
            ) : summaryError ? (
              '加载失败'
            ) : (
              formatCompactNumber(summaryOverview.total_requests)
            )
          }
        />
        <SummaryCard
          label="花费"
          value={
            summaryLoading ? (
              <SummaryValueLoading />
            ) : summaryError ? (
              '加载失败'
            ) : (
              formatCurrency(summaryOverview.total_cost, currency)
            )
          }
        />
        <SummaryCard
          label="成功率"
          value={summaryLoading ? <SummaryValueLoading /> : summaryError ? '加载失败' : `${successRate.toFixed(1)}%`}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <PanelShell title="费用分布">
          {analyticsAreaLoading ? (
            <PanelLoadingState />
          ) : analyticsAreaError ? (
            <ErrorBanner
              message="模型分析暂时不可用。"
              onRetry={() => {
                void mutateAnalytics()
                void mutateFallbackStats()
                void mutateFallbackEvents()
              }}
            />
          ) : (
            <ReactECharts
              option={analyticsViewModel.hasData ? stackedBarOption : emptyStackedBarOption}
              style={{ height: '320px', width: '100%' }}
            />
          )}
        </PanelShell>

        <section className="rounded-lg border border-gray-100 bg-white p-5 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <div className="mb-4 inline-flex rounded-full bg-gray-100 p-1">
            {([['donut', '请求占比'], ['ranking', '请求排行']] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={rightPanelTab === key}
                onClick={() => setRightPanelTab(key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  rightPanelTab === key
                    ? 'bg-white text-gray-950 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.75)]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {analyticsAreaLoading ? (
            <PanelLoadingState />
          ) : analyticsAreaError ? (
            <ErrorBanner
              message="模型分析暂时不可用。"
              onRetry={() => {
                void mutateAnalytics()
                void mutateFallbackStats()
                void mutateFallbackEvents()
              }}
            />
          ) : rightPanelTab === 'donut' ? (
            <ReactECharts
              option={analyticsViewModel.hasData ? donutOption : emptyDonutOption}
              style={{ height: '320px', width: '100%' }}
            />
          ) : analyticsViewModel.hasData ? (
            <div className="space-y-3">
              {analyticsViewModel.ranking.map((item, index) => (
                <div
                  key={item.model}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs text-gray-500">
                      {index + 1}
                    </span>
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-gray-950">{item.model}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(item.totalCost, currency)}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm text-gray-950">{formatCompactNumber(item.requestCount)} 次</p>
                    <p className="text-xs text-gray-500">{item.requestSharePercent.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyRankingState />
          )}
        </section>
      </section>

      <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg text-gray-900">Token 使用趋势</h3>
          </div>

          <div className="inline-flex rounded-full bg-gray-100 p-1">
            {TREND_RANGE_OPTIONS.map((option) => (
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
          {trendStatsLoading ? (
            <div className="flex h-full flex-col justify-center gap-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6">
              <p className="text-sm text-gray-500">正在加载 Token 趋势...</p>
              <div className="space-y-3">
                <div className="h-3 w-full animate-pulse rounded-full bg-gray-200" />
                <div className="h-3 w-5/6 animate-pulse rounded-full bg-gray-200" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-gray-200" />
              </div>
            </div>
          ) : trendStatsError ? (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50/60 px-6 text-center text-sm text-red-600">
              Token 趋势加载失败，请稍后重试。
            </div>
          ) : (
            <ReactECharts option={trendOption} style={{ height: '100%', width: '100%' }} />
          )}
        </div>
      </section>
    </div>
  )
}
