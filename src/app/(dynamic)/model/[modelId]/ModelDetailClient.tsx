'use client'

import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
import { getModelBySlug } from '@/lib/api/model-catalog'
import type { ModelDetail } from '@/types/model'
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

      </div>
    </main>
  )
}
