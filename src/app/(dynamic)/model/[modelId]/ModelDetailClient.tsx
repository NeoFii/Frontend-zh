'use client'

import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
import { getModelBySlug } from '@/lib/api/testing-model'
import type { ModelDetail, ModelOffering } from '@/types/model'
import MarkdownRenderer from '@/components/MarkdownRenderer'

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

const formatFenPrice = (fen?: number | null): string => {
  if (fen == null) return '待配置'
  return `¥${(fen / 100).toFixed(2)}`
}

// 提供商卡片：展示一个提供商的性能探测均值
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

          {model.summary && (
            <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-[#4B5563]">
              {model.summary}
            </p>
          )}
        </div>

        {/* 关键信息卡片 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">上下文窗口</div>
            <div className="text-[24px] font-semibold text-[#181E25]">
              {formatContextWindow(model.context_window)}
            </div>
            <div className="text-[12px] text-[#666666] mt-1">tokens</div>
          </div>

          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">每百万输入价格</div>
            <div className="text-[24px] font-semibold text-[#181E25]">
              {formatFenPrice(model.price_input_per_m_fen)}
            </div>
          </div>

          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">每百万输出价格</div>
            <div className="text-[24px] font-semibold text-[#181E25]">
              {formatFenPrice(model.price_output_per_m_fen)}
            </div>
          </div>
        </section>

        {/* 模型描述 */}
        {model.description && (
          <section className="mb-8">
            <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">模型介绍</h2>
            <div className="bg-[#F7F8FA] rounded-xl p-6">
              <MarkdownRenderer content={model.description} />
            </div>
          </section>
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
      </div>
    </main>
  )
}
