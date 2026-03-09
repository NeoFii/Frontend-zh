'use client'

/**
 * 性能测试展示页面
 * 展示所有模型供应商的性能统计对比
 */

import React from 'react'
import useSWR from 'swr'
import { getBenchmarkStatsSummary } from '@/lib/api/model'
import type { BenchmarkStatsSummaryItem } from '@/types/model'

// 格式化数字
const formatNumber = (num: number | undefined, decimals: number = 2): string => {
  if (num === undefined || num === null) return '-'
  return num.toFixed(decimals)
}

// 供应商统计卡片
const ProviderStatsCard: React.FC<{
  provider: BenchmarkStatsSummaryItem['providers'][0]
}> = ({ provider }) => {
  const hasStats = provider.stats && provider.stats.test_count > 0

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-medium text-[#181E25]">
          {provider.provider_name}
        </span>
        {provider.stats?.last_test_at && (
          <span className="text-[11px] text-[#9CA3AF]">
            {new Date(provider.stats.last_test_at).toLocaleDateString('zh-CN')}
          </span>
        )}
      </div>

      {hasStats ? (
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div className="bg-[#F7F8FA] rounded-lg p-2">
            <div className="text-[#9CA3AF] mb-1">首字延迟</div>
            <div className="text-[#181E25] font-medium">
              {formatNumber(provider.stats?.avg_latency_ttft)}s
            </div>
          </div>
          <div className="bg-[#F7F8FA] rounded-lg p-2">
            <div className="text-[#9CA3AF] mb-1">总延迟</div>
            <div className="text-[#181E25] font-medium">
              {formatNumber(provider.stats?.avg_latency_total)}s
            </div>
          </div>
          <div className="bg-[#F7F8FA] rounded-lg p-2">
            <div className="text-[#9CA3AF] mb-1">吞吐量</div>
            <div className="text-[#181E25] font-medium">
              {formatNumber(provider.stats?.avg_throughput, 1)} tokens/s
            </div>
          </div>
          <div className="bg-[#F7F8FA] rounded-lg p-2">
            <div className="text-[#9CA3AF] mb-1">成功率</div>
            <div className="text-[#181E25] font-medium">
              {formatNumber(provider.stats?.success_rate)}%
            </div>
          </div>
        </div>
      ) : (
        <div className="text-[12px] text-[#9CA3AF] text-center py-4">
          暂无测试数据
        </div>
      )}
    </div>
  )
}

// 模型行
const ModelRow: React.FC<{
  model: BenchmarkStatsSummaryItem
}> = ({ model }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 mb-4">
      <h3 className="text-[16px] font-semibold text-[#181E25] mb-1">
        {model.model_name}
      </h3>
      <p className="text-[12px] text-[#9CA3AF] font-mono mb-4">
        {model.model_id}
      </p>

      {model.providers && model.providers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {model.providers.map((provider) => (
            <ProviderStatsCard key={provider.model_provider_id} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="text-[14px] text-[#9CA3AF] text-center py-4">
          暂无供应商数据
        </div>
      )}
    </div>
  )
}

export default function BenchmarkPage() {
  // 获取性能统计汇总
  const { data: statsData, isLoading, error } = useSWR(
    'benchmark-stats',
    () => getBenchmarkStatsSummary(24)
  )

  const models = statsData || []

  // 按模型数量排序
  const sortedModels = React.useMemo(() => {
    const data = statsData || []
    return [...data].sort((a, b) => {
      const aCount = a.providers?.length || 0
      const bCount = b.providers?.length || 0
      return bCount - aCount
    })
  }, [statsData])

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
            <p className="text-[14px] text-[#666666]">
              请确保后端服务已启动
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* 标题区域 */}
        <div className="mb-8">
          <h1 className="text-[24px] lg:text-[28px] font-semibold text-[#181E25] mb-2">
            性能测试
          </h1>
          <p className="text-[14px] text-[#666666]">
            查看各模型供应商的性能对比数据
          </p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">模型数量</div>
            <div className="text-[32px] font-semibold text-[#181E25]">
              {models.length}
            </div>
          </div>
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">供应商总数</div>
            <div className="text-[32px] font-semibold text-[#181E25]">
              {models.reduce((acc, m) => acc + (m.providers?.length || 0), 0)}
            </div>
          </div>
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">统计时间范围</div>
            <div className="text-[32px] font-semibold text-[#181E25]">
              24h
            </div>
          </div>
        </div>

        {/* 模型列表 */}
        {sortedModels.length > 0 ? (
          sortedModels.map((model) => (
            <ModelRow key={model.model_id} model={model} />
          ))
        ) : (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              className="text-[#E5E7EB] mx-auto mb-4"
            >
              <path
                d="M56 56M8 8L28 28M36 28L56 8M28 36L8 56"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="28"
                cy="28"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
              />
              <circle cx="36" cy="36" r="4" fill="currentColor" />
            </svg>
            <p className="text-[16px] text-[#666666]">暂无性能测试数据</p>
            <p className="text-[14px] text-[#9CA3AF] mt-1">
              请先添加模型和供应商数据
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
