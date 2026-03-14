'use client'

/**
 * 性能测试展示页面
 * 展示所有模型提供商的近期性能统计对比（来自 provider_metrics_ranked 视图）
 */

import React from 'react'
import useSWR from 'swr'
import { getBenchmarkStatsSummary } from '@/lib/api/testing-model'
import type { BenchmarkModelSummary, BenchmarkOfferingSummary } from '@/types/model'

// 格式化数字
const fmt = (num: number | undefined | null, decimals = 1): string => {
  if (num == null) return '-'
  return num.toFixed(decimals)
}

// 单个提供商的性能卡片
const OfferingStatsCard: React.FC<{ offering: BenchmarkOfferingSummary }> = ({ offering }) => {
  const { metrics } = offering
  const hasMetrics = metrics && metrics.sample_count > 0

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-medium text-[#181E25]">{offering.provider_name}</span>
        {metrics?.last_measured_at && (
          <span className="text-[11px] text-[#9CA3AF]">
            {new Date(metrics.last_measured_at).toLocaleDateString('zh-CN')}
          </span>
        )}
      </div>

      {hasMetrics ? (
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div className="bg-[#F7F8FA] rounded-lg p-2">
            <div className="text-[#9CA3AF] mb-1">首字延迟</div>
            <div className="text-[#181E25] font-medium">{fmt(metrics?.avg_ttft_ms, 0)}ms</div>
          </div>
          <div className="bg-[#F7F8FA] rounded-lg p-2">
            <div className="text-[#9CA3AF] mb-1">E2E 延迟</div>
            <div className="text-[#181E25] font-medium">{fmt(metrics?.avg_e2e_latency_ms, 0)}ms</div>
          </div>
          <div className="bg-[#F7F8FA] rounded-lg p-2">
            <div className="text-[#9CA3AF] mb-1">吞吐量</div>
            <div className="text-[#181E25] font-medium">{fmt(metrics?.avg_throughput_tps)} t/s</div>
          </div>
          <div className="bg-[#F7F8FA] rounded-lg p-2">
            <div className="text-[#9CA3AF] mb-1">样本数</div>
            <div className="text-[#181E25] font-medium">{metrics?.sample_count}</div>
          </div>
        </div>
      ) : (
        <div className="text-[12px] text-[#9CA3AF] text-center py-4">暂无探测数据</div>
      )}
    </div>
  )
}

// 模型行
const ModelRow: React.FC<{ model: BenchmarkModelSummary }> = ({ model }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-5 mb-4">
    <h3 className="text-[16px] font-semibold text-[#181E25] mb-1">{model.model_name}</h3>
    <p className="text-[12px] text-[#9CA3AF] font-mono mb-4">
      {model.vendor_name} · {model.model_slug}
    </p>

    {model.offerings.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {model.offerings.map((offering) => (
          <OfferingStatsCard key={offering.offering_id} offering={offering} />
        ))}
      </div>
    ) : (
      <div className="text-[14px] text-[#9CA3AF] text-center py-4">暂无提供商数据</div>
    )}
  </div>
)

export default function BenchmarkPage() {
  const { data: models = [], isLoading, error } = useSWR<BenchmarkModelSummary[]>(
    'benchmark-stats',
    () => getBenchmarkStatsSummary(5)
  )

  const sortedModels = React.useMemo(
    () => [...models].sort((a, b) => b.offerings.length - a.offerings.length),
    [models]
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

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="text-center py-16">
            <h1 className="text-[20px] text-[#EF4444] mb-4">加载失败</h1>
            <p className="text-[14px] text-[#666666]">请确保后端服务已启动</p>
          </div>
        </div>
      </main>
    )
  }

  const totalOfferings = models.reduce((acc, m) => acc + m.offerings.length, 0)

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* 标题区域 */}
        <div className="mb-8">
          <h1 className="text-[24px] lg:text-[28px] font-semibold text-[#181E25] mb-2">
            性能统计
          </h1>
          <p className="text-[14px] text-[#666666]">
            各模型提供商近 5 次成功探测的性能均值对比
          </p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">模型数量</div>
            <div className="text-[32px] font-semibold text-[#181E25]">{models.length}</div>
          </div>
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">报价总数</div>
            <div className="text-[32px] font-semibold text-[#181E25]">{totalOfferings}</div>
          </div>
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">样本窗口</div>
            <div className="text-[32px] font-semibold text-[#181E25]">5</div>
          </div>
        </div>

        {/* 模型列表 */}
        {sortedModels.length > 0 ? (
          sortedModels.map((model) => (
            <ModelRow key={model.model_slug} model={model} />
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-[16px] text-[#666666]">暂无性能测试数据</p>
            <p className="text-[14px] text-[#9CA3AF] mt-1">请先添加模型和报价数据，等待探测任务执行</p>
          </div>
        )}
      </div>
    </main>
  )
}
