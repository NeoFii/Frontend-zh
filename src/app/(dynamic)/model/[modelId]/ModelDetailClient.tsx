'use client'

/**
 * 模型详情页面
 * 展示模型详细信息和供应商列表
 */

import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { getModelById, getModelProviders } from '@/lib/api/model'
import type { ModelDetail, ModelProviderInfo } from '@/types/model'

interface ModelDetailPageProps {
  modelId: string
}

// 格式化上下文长度
const formatContextLength = (length: number): string => {
  if (length >= 1000000) {
    return `${(length / 1000000).toFixed(0)}M`
  }
  if (length >= 1000) {
    return `${(length / 1000).toFixed(0)}K`
  }
  return String(length)
}

// 供应商卡片组件
const ProviderCard: React.FC<{ provider: ModelProviderInfo; t: (key: string) => string }> = ({ provider, t }) => {
  const hasStats = provider.stats && provider.stats.test_count > 0

  return (
    <div className="bg-[#F7F8FA] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: provider.color || '#6366F1' }}
          >
            {provider.provider_name.charAt(0)}
          </div>
          <div>
            <h4 className="text-[16px] font-semibold text-[#181E25]">
              {provider.provider_name}
            </h4>
            <p className="text-[12px] text-[#9CA3AF] font-mono">
              {provider.api_model_name}
            </p>
          </div>
        </div>
        {provider.is_default && (
          <span className="px-2 py-1 text-[10px] bg-[#2563EB] text-white rounded">
            {t('defaultTag')}
          </span>
        )}
      </div>

      {/* 价格信息 */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-[13px]">
        <div>
          <span className="text-[#9CA3AF]">{t('input')}: </span>
          <span className="text-[#181E25]">
            {provider.input_price_cny_1m
              ? `¥${provider.input_price_cny_1m}/1M`
              : '-'}
          </span>
        </div>
        <div>
          <span className="text-[#9CA3AF]">{t('output')}: </span>
          <span className="text-[#181E25]">
            {provider.output_price_cny_1m
              ? `¥${provider.output_price_cny_1m}/1M`
              : '-'}
          </span>
        </div>
      </div>

      {/* 限速信息 */}
      <div className="text-[12px] text-[#9CA3AF] mb-4">
        {t('rateLimit')}: {provider.rate_limit_rpm} RPM
      </div>

      {/* 性能统计 */}
      {hasStats ? (
        <div className="border-t border-gray-200 pt-4">
          <h5 className="text-[14px] font-medium text-[#181E25] mb-3">
            {t('performanceStats')}
          </h5>
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div>
              <span className="text-[#9CA3AF]">{t('ttft')}: </span>
              <span className="text-[#181E25]">
                {provider.stats?.avg_latency_ttft
                  ? `${provider.stats.avg_latency_ttft.toFixed(2)}s`
                  : '-'}
              </span>
            </div>
            <div>
              <span className="text-[#9CA3AF]">{t('totalLatency')}: </span>
              <span className="text-[#181E25]">
                {provider.stats?.avg_latency_total
                  ? `${provider.stats.avg_latency_total.toFixed(2)}s`
                  : '-'}
              </span>
            </div>
            <div>
              <span className="text-[#9CA3AF]">{t('throughput')}: </span>
              <span className="text-[#181E25]">
                {provider.stats?.avg_throughput
                  ? `${provider.stats.avg_throughput.toFixed(1)} tokens/s`
                  : '-'}
              </span>
            </div>
            <div>
              <span className="text-[#9CA3AF]">{t('successRate')}: </span>
              <span className="text-[#181E25]">
                {provider.stats?.success_rate
                  ? `${provider.stats.success_rate.toFixed(1)}%`
                  : '-'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-200 pt-4 text-[12px] text-[#9CA3AF]">
          {t('noPerformanceData')}
        </div>
      )}
    </div>
  )
}

export default function ModelDetailPage({ modelId }: ModelDetailPageProps) {
  const { t } = useTranslation('model')

  // 获取模型详情
  const { data: model, isLoading: loadingModel } = useSWR<ModelDetail>(
    ['model', modelId],
    () => getModelById(modelId)
  )

  // 获取供应商列表
  const { data: providersData, isLoading: loadingProviders } = useSWR(
    ['model-providers', modelId],
    () => getModelProviders(modelId)
  )

  const providers = providersData?.items || []
  const isLoading = loadingModel || loadingProviders

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
            <h1 className="text-[20px] text-[#181E25] mb-4">{t('modelNotFound')}</h1>
            <Link href="/model" className="text-[#2563EB] hover:underline">
              {t('backToList')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1000px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* 返回按钮 */}
        <Link
          href="/model"
          className="inline-flex items-center gap-2 text-[14px] text-[#666666] hover:text-[#181E25] transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t('backToList')}
        </Link>

        {/* 头部信息 */}
        <div className="mb-8">
          {/* 分类标签 */}
          {model.categories && model.categories.length > 0 && (
            <div className="flex gap-2 mb-4">
              {model.categories.map((cat) => (
                <span
                  key={cat.slug}
                  className="px-3 py-1 text-[12px] text-[#666666] bg-[#F3F4F6] rounded-full"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* 模型名称 */}
          <h1 className="text-[28px] lg:text-[32px] font-semibold text-[#181E25] mb-2">
            {model.name}
          </h1>

          {/* 模型 ID */}
          <p className="text-[14px] text-[#9CA3AF] font-mono mb-4">
            {model.model_id}
          </p>

          {/* 开源标签 */}
          {model.is_open_source && (
            <span className="px-2 py-1 text-[10px] text-[#059669] bg-[#D1FAE5] rounded">
              {t('openSourceTag')}
            </span>
          )}
        </div>

        {/* 关键信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 上下文长度 */}
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">{t('contextLength')}</div>
            <div className="text-[24px] font-semibold text-[#181E25]">
              {formatContextLength(model.context_length)}
            </div>
            <div className="text-[12px] text-[#666666] mt-1">tokens</div>
          </div>

          {/* 模型大小 */}
          {model.model_size && (
            <div className="bg-[#F7F8FA] rounded-xl p-5">
              <div className="text-[13px] text-[#666666] mb-1">{t('modelSize')}</div>
              <div className="text-[24px] font-semibold text-[#181E25]">
                {model.model_size}
              </div>
            </div>
          )}

          {/* 供应商数量 */}
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">{t('availableProviders')}</div>
            <div className="text-[24px] font-semibold text-[#181E25]">
              {providers.length}
            </div>
          </div>
        </div>

        {/* 模型描述 */}
        {model.description && (
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
              {t('modelDescription')}
            </h2>
            <div className="bg-[#F7F8FA] rounded-xl p-6">
              <p className="text-[15px] text-[#666666] leading-[1.8]">
                {model.description}
              </p>
            </div>
          </div>
        )}

        {/* 标签 */}
        {model.tags && model.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
              {t('tags')}
            </h2>
            <div className="flex flex-wrap gap-3">
              {model.tags.map((tag) => (
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

        {/* 供应商列表 */}
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
            {t('providerList')}
          </h2>
          {providers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <ProviderCard key={provider.model_provider_id} provider={provider} t={t} />
              ))}
            </div>
          ) : (
            <div className="bg-[#F7F8FA] rounded-xl p-6 text-center text-[14px] text-[#9CA3AF]">
              {t('noProviderData')}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <Link
            href="/console/usage/record"
            className="px-6 py-3 bg-[#181E25] text-white text-[14px] font-medium rounded-lg hover:opacity-90 transition-opacity inline-block"
          >
            {t('tryNow')}
          </Link>
          <Link
            href="/docs"
            className="px-6 py-3 border border-gray-200 text-[#181E25] text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors inline-block"
          >
            {t('viewDocs')}
          </Link>
        </div>
      </div>
    </main>
  )
}
