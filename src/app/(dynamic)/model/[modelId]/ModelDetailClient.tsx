'use client'

/**
 * 模型详情客户端组件
 * 通过 slug 获取模型详细信息，展示研发商报价和性能指标
 * 底部展示多日性能趋势图表（ECharts 折线图 + 汇总表格）
 */

import React, { memo, startTransition, useDeferredValue, useMemo, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { getModelBySlug, getBenchmarkTrends } from '@/lib/api/testing-model'
import type { ModelDetail, ModelOffering, BenchmarkTrendResponse } from '@/types/model'
import MarkdownRenderer from '@/components/MarkdownRenderer'

// ECharts 动态导入（避免 SSR）
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[350px]">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
    </div>
  ),
})

// ECharts 按需注册
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
])

// 趋势图调色板（10 色）
const TREND_COLORS = [
  '#3366FF', // 蓝
  '#22C55E', // 绿
  '#F59E0B', // 黄
  '#EF4444', // 红
  '#06B6D4', // 青
  '#8B5CF6', // 紫
  '#EC4899', // 粉
  '#F97316', // 橙
  '#14B8A6', // 碧
  '#6366F1', // 靛
]

type TrendMetric = 'throughput' | 'ttft' | 'e2e'

const METRIC_CONFIG: Record<TrendMetric, { label: string; unit: string; key: string }> = {
  throughput: { label: '吞吐', unit: 'tokens/s', key: 'avg_throughput_tps' },
  ttft: { label: '首字延迟', unit: 'ms', key: 'avg_ttft_ms' },
  e2e: { label: 'E2E 延迟', unit: 'ms', key: 'avg_e2e_latency_ms' },
}

interface ModelDetailClientProps {
  modelId: string
}

// 格式化上下文窗口大小
const formatContextWindow = (tokens?: number): string => {
  if (!tokens) return '-'
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(0)}M`
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`
  return String(tokens)
}

// 报价卡片：展示一个提供商的价格和性能探测均值
const OfferingCard: React.FC<{ offering: ModelOffering }> = ({ offering }) => {
  const { provider, metrics } = offering
  const hasMetrics = metrics && metrics.sample_count > 0

  return (
    <div className="bg-[#F7F8FA] rounded-xl p-5">
      {/* 提供商头部 */}
      <div className="flex items-center gap-3 mb-4">
        {provider.logo_url ? (
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={provider.logo_url}
              alt={provider.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-[#6366F1] flex items-center justify-center text-white font-bold">
            {provider.name.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="text-[16px] font-semibold text-[#181E25]">{provider.name}</h4>
        </div>
      </div>

      {/* 价格信息 */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-[13px]">
        <div>
          <span className="text-[#9CA3AF]">输入: </span>
          <span className="text-[#181E25]">
            {offering.price_input_per_m != null
              ? `¥${offering.price_input_per_m}/1M`
              : '-'}
          </span>
        </div>
        <div>
          <span className="text-[#9CA3AF]">输出: </span>
          <span className="text-[#181E25]">
            {offering.price_output_per_m != null
              ? `¥${offering.price_output_per_m}/1M`
              : '-'}
          </span>
        </div>
      </div>

      {/* 性能探测均值 */}
      <div className="border-t border-gray-200 pt-4">
        {hasMetrics ? (
          <>
            <h5 className="text-[13px] font-medium text-[#181E25] mb-3">近期性能（均值）</h5>
            <div className="grid grid-cols-3 gap-3 text-[12px]">
              <div>
                <div className="text-[#9CA3AF] mb-1">首字延迟</div>
                <div className="text-[#181E25] font-medium">
                  {metrics.avg_ttft_ms != null ? `${metrics.avg_ttft_ms}ms` : '-'}
                </div>
              </div>
              <div>
                <div className="text-[#9CA3AF] mb-1">E2E 延迟</div>
                <div className="text-[#181E25] font-medium">
                  {metrics.avg_e2e_latency_ms != null ? `${metrics.avg_e2e_latency_ms}ms` : '-'}
                </div>
              </div>
              <div>
                <div className="text-[#9CA3AF] mb-1">吞吐量</div>
                <div className="text-[#181E25] font-medium">
                  {metrics.avg_throughput_tps != null
                    ? `${metrics.avg_throughput_tps.toFixed(1)} t/s`
                    : '-'}
                </div>
              </div>
            </div>
            <div className="hidden">
              近 {metrics.sample_count} 次探测均值
              {metrics.probe_region && ` · ${metrics.probe_region}`}
            </div>
          </>
        ) : (
          <p className="text-[12px] text-[#9CA3AF]">暂无性能探测数据</p>
        )}
      </div>
    </div>
  )
}

export default function ModelDetailClient({ modelId }: ModelDetailClientProps) {
  // modelId 参数实际上是模型的 slug
  const { data: model, isLoading } = useSWR<ModelDetail>(
    ['model', modelId],
    () => getModelBySlug(modelId)
  )

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#181E25]" />
        </div>
      </main>
    )
  }

  if (!model) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-[1000px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="text-center py-16">
            <h1 className="text-[20px] text-[#181E25] mb-4">模型不存在</h1>
            <Link href="/model" className="text-[#2563EB] hover:underline">
              返回模型列表
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const activeOfferings = model.offerings.filter((o) => o.is_active)

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1000px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* 返回按钮 */}
        <Link
          href="/model"
          className="inline-flex items-center gap-2 text-[14px] text-[#666666] hover:text-[#181E25] transition-colors mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          返回模型列表
        </Link>

        {/* 头部：Logo + 研发商/模型名 + 分类标签 */}
        <div className="mb-8">
          {/* Logo + 标题 */}
          <div className="flex items-center gap-4 mb-4">
            {model.vendor.logo_url && (
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image src={model.vendor.logo_url} alt={model.vendor.name} fill className="object-contain" />
              </div>
            )}
            <h1 className="text-[28px] lg:text-[32px] font-normal text-[#181E25]">
              {model.vendor.name}
              <span className="text-[#C4C9D0] mx-2">/</span>
              {model.name}
            </h1>
          </div>

          {/* 分类标签 */}
          {(model.categories.length > 0 || model.is_reasoning_model) && (
            <div className="flex flex-wrap gap-2">
              {model.categories.map((cat) => (
                <span
                  key={cat.key}
                  className="px-3 py-1 text-[12px] text-[#666666] bg-[#F3F4F6] rounded-full"
                >
                  {cat.name}
                </span>
              ))}
              {model.is_reasoning_model && (
                <span className="px-3 py-1 text-[12px] text-[#7C3AED] bg-[#EDE9FE] rounded-full">
                  推理模型
                </span>
              )}
            </div>
          )}
        </div>

        {/* 关键信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">上下文窗口</div>
            <div className="text-[24px] font-semibold text-[#181E25]">
              {formatContextWindow(model.context_window)}
            </div>
            <div className="text-[12px] text-[#666666] mt-1">tokens</div>
          </div>

          {model.max_output_tokens && (
            <div className="bg-[#F7F8FA] rounded-xl p-5">
              <div className="text-[13px] text-[#666666] mb-1">最大输出</div>
              <div className="text-[24px] font-semibold text-[#181E25]">
                {formatContextWindow(model.max_output_tokens)}
              </div>
              <div className="text-[12px] text-[#666666] mt-1">tokens</div>
            </div>
          )}

          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">可用提供商</div>
            <div className="text-[24px] font-semibold text-[#181E25]">
              {activeOfferings.length}
            </div>
          </div>
        </div>

        {/* 模型描述 */}
        {model.description && (
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">模型描述</h2>
            <div className="bg-[#F7F8FA] rounded-xl p-6">
              <MarkdownRenderer content={model.description} />
            </div>
          </div>
        )}

        {/* 能力标签 */}
        {model.capability_tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">能力标签</h2>
            <div className="flex flex-wrap gap-3">
              {model.capability_tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-[#F7F8FA] rounded-lg text-[14px] text-[#181E25]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 报价与性能 */}
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">支持服务商与性能</h2>
          {activeOfferings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeOfferings.map((offering) => (
                <OfferingCard key={offering.id} offering={offering} />
              ))}
            </div>
          ) : (
            <div className="bg-[#F7F8FA] rounded-xl p-6 text-center text-[14px] text-[#9CA3AF]">
              暂无可用提供商数据
            </div>
          )}
        </div>

        {/* 性能趋势图表 */}
        <PerformanceTrendSection modelSlug={model.slug} />
      </div>
    </main>
  )
}

// ========== 性能趋势区域 ==========

interface PerformanceTrendSectionProps {
  modelSlug: string
}

const PerformanceTrendSection = memo(function PerformanceTrendSection({
  modelSlug,
}: PerformanceTrendSectionProps) {
  const [trendDays, setTrendDays] = useState(7)
  const [trendMetric, setTrendMetric] = useState<TrendMetric>('throughput')
  const deferredTrendDays = useDeferredValue(trendDays)
  const { data: trendData, isLoading: trendLoading } = useSWR<BenchmarkTrendResponse>(
    ['benchmark-trend', modelSlug, deferredTrendDays],
    () => getBenchmarkTrends(modelSlug, deferredTrendDays),
  )
  const metricCfg = METRIC_CONFIG[trendMetric]
  const hasData = trendData && trendData.providers.length > 0

  // ECharts option
  const chartOption = useMemo(() => {
    if (!trendData || trendData.providers.length === 0) return {}

    const series = trendData.providers.map((provider, idx) => ({
      name: provider.provider_name,
      type: 'line' as const,
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      data: provider.data_points.map((dp) => {
        const val = dp[metricCfg.key as keyof typeof dp]
        return val != null ? [dp.date, val] : null
      }).filter((point): point is [string, number] => point != null),
      itemStyle: { color: TREND_COLORS[idx % TREND_COLORS.length] },
      lineStyle: { width: 2 },
      connectNulls: false,
    }))

    return {
      echarts,
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        textStyle: { color: '#181E25', fontSize: 12 },
        formatter: (params: Array<{ seriesName: string; value: number | [string, number] | null; color: string; axisValue: string }>) => {
          const header = `<div style="font-weight:600;margin-bottom:6px">${params[0]?.axisValue}</div>`
          const rows = params
            .filter((p) => p.value != null)
            .map(
              (p) => {
                const value = Array.isArray(p.value) ? p.value[1] : p.value
                return (
                `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">` +
                `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>` +
                `<span>${p.seriesName}</span>` +
                `<span style="margin-left:auto;font-weight:600">${value} ${metricCfg.unit}</span>` +
                `</div>`
                )
              }
            )
            .join('')
          return header + rows
        },
      },
      legend: {
        data: trendData.providers.map((p) => p.provider_name),
        bottom: 0,
        textStyle: { color: '#666666', fontSize: 12 },
        itemWidth: 12,
        itemHeight: 12,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#9CA3AF',
          fontSize: 12,
          formatter: (value: string | number) =>
            new Date(value).toLocaleString('zh-CN', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
        },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 12 },
        splitLine: { lineStyle: { color: '#F3F4F6' } },
      },
      series,
    }
  }, [trendData, metricCfg])

  // 汇总表格数据
  const tableData = useMemo(() => {
    if (!trendData) return []
    return trendData.providers.map((p, idx) => {
      let minVal: number | undefined
      let maxVal: number | undefined
      let avgVal: number | undefined

      if (trendMetric === 'throughput') {
        minVal = p.min_throughput ?? undefined
        maxVal = p.max_throughput ?? undefined
        avgVal = p.avg_throughput ?? undefined
      } else if (trendMetric === 'ttft') {
        minVal = p.min_ttft ?? undefined
        maxVal = p.max_ttft ?? undefined
        avgVal = p.avg_ttft ?? undefined
      } else {
        // 从 data_points 计算 e2e 汇总
        const vals = p.data_points
          .map((dp) => dp.avg_e2e_latency_ms)
          .filter((v): v is number => v != null)
        if (vals.length > 0) {
          minVal = Math.min(...vals)
          maxVal = Math.max(...vals)
          avgVal = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
        }
      }

      return {
        name: p.provider_name,
        color: TREND_COLORS[idx % TREND_COLORS.length],
        minVal,
        maxVal,
        avgVal,
      }
    })
  }, [trendData, trendMetric])

  const fmtVal = (v?: number) => (v != null ? v.toFixed(trendMetric === 'throughput' ? 2 : 0) : '-')

  return (
    <div className="mb-8">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[#181E25]">性能趋势</h2>
          {trendData?.date_range && (
            <p className="text-[13px] text-[#9CA3AF] mt-1">
              近{trendDays}日平均数据 | {trendData.date_range}
            </p>
          )}
        </div>
        {/* 天数切换 */}
        <div className="flex items-center gap-1">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                startTransition(() => setTrendDays(d))
              }}
              className={`px-3 py-1.5 text-[13px] rounded-lg transition-colors ${
                trendDays === d
                  ? 'bg-[#181E25] text-white'
                  : 'bg-[#F3F4F6] text-[#666666] hover:bg-[#E5E7EB]'
              }`}
            >
              {d}日
            </button>
          ))}
        </div>
      </div>

      {/* 指标切换 Tab */}
      <div className="flex items-center gap-1 mb-4">
        {(Object.keys(METRIC_CONFIG) as TrendMetric[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              startTransition(() => setTrendMetric(key))
            }}
            className={`px-4 py-2 text-[13px] rounded-lg transition-colors ${
              trendMetric === key
                ? 'bg-[#EFF6FF] text-[#2563EB] font-medium'
                : 'text-[#666666] hover:bg-[#F3F4F6]'
            }`}
          >
            {METRIC_CONFIG[key].label}({METRIC_CONFIG[key].unit})
          </button>
        ))}
      </div>

      {/* 图表区域 */}
      {trendLoading ? (
        <div className="bg-[#F7F8FA] rounded-xl p-8 text-center text-[14px] text-[#9CA3AF]">
          加载趋势数据中...
        </div>
      ) : null}

      {!trendLoading && hasData ? (
        <>
          <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
            <ReactECharts option={chartOption} style={{ height: '350px' }} />
          </div>

          {/* 汇总表格 */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-[#9CA3AF] font-normal">服务商</th>
                  <th className="text-right py-3 px-4 text-[#9CA3AF] font-normal">
                    最低({metricCfg.unit})
                  </th>
                  <th className="text-right py-3 px-4 text-[#9CA3AF] font-normal">
                    最高({metricCfg.unit})
                  </th>
                  <th className="text-right py-3 px-4 text-[#2563EB] font-medium">
                    平均({metricCfg.unit})
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.name} className="border-b border-gray-50 last:border-b-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: row.color }}
                        />
                        <span className="text-[#181E25]">{row.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-[#181E25]">{fmtVal(row.minVal)}</td>
                    <td className="text-right py-3 px-4 text-[#181E25]">{fmtVal(row.maxVal)}</td>
                    <td className="text-right py-3 px-4 text-[#181E25] font-medium">
                      {fmtVal(row.avgVal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      {!trendLoading && !hasData ? (
        <div className="bg-[#F7F8FA] rounded-xl p-8 text-center text-[14px] text-[#9CA3AF]">
          暂无性能趋势数据
        </div>
      ) : null}
    </div>
  )
})
