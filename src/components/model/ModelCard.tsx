'use client'

/**
 * 模型卡片组件
 * 适配后端新 API 返回的数据结构（slug、capability_tags、vendor、context_window）
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ModelListItem } from '@/types/model'
import { formatFenPerMillionTokens } from '@/lib/pricing'

interface ModelCardProps {
  model: ModelListItem
}

// 格式化上下文窗口大小
const formatContextWindow = (tokens?: number): string => {
  if (!tokens) return '-'
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(0)}M`
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`
  return String(tokens)
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  // 取第一个分类名作为主分类标签
  const primaryCategory = model.categories[0]

  return (
    <Link href={`/model/${model.slug}`} className="block">
      <div className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full">
        {/* 头部：研发商 Logo + 分类 */}
        <div className="flex items-center justify-between mb-3">
          {/* 研发商 Logo */}
          {model.vendor.logo_url ? (
            <div className="relative w-[42px] h-[42px] flex-shrink-0">
              <Image
                src={model.vendor.logo_url}
                alt={model.vendor.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <span />
          )}
          {primaryCategory ? (
            <span className="px-3 py-1 text-[12px] text-[#666666] bg-[#F3F4F6] rounded-full">
              {primaryCategory.name}
            </span>
          ) : (
            <span />
          )}
        </div>

        {/* 模型名称：研发商名称/模型名称 */}
        <h3 className="text-[16px] font-semibold text-[#181E25] mb-3 line-clamp-2 leading-tight">
          {model.vendor.name}/{model.name}
        </h3>

        {/* 能力标签 */}
        {model.capability_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {model.capability_tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] text-[#4B5563] bg-[#F3F4F6] rounded"
              >
                {tag}
              </span>
            ))}
            {model.is_reasoning_model && (
              <span className="px-2 py-0.5 text-[11px] text-[#7C3AED] bg-[#EDE9FE] rounded">
                推理
              </span>
            )}
          </div>
        )}

        {/* 底部：上下文窗口 + 模型级价格 */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="min-w-0">
              <div className="text-[10px] font-medium text-[#9CA3AF]">CTX</div>
              <div className="mt-1 text-[13px] font-semibold text-[#181E25]">
                {formatContextWindow(model.context_window)}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-medium text-[#9CA3AF]">IN / 1M</div>
              <div className="mt-1 text-[13px] font-semibold text-[#181E25]">
                {formatFenPerMillionTokens(model.price_input_per_m_fen)}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-medium text-[#9CA3AF]">OUT / 1M</div>
              <div className="mt-1 text-[13px] font-semibold text-[#181E25]">
                {formatFenPerMillionTokens(model.price_output_per_m_fen)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ModelCard
