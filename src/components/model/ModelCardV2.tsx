'use client'

/**
 * 模型卡片组件
 * 适配后端新 API 返回的数据结构（slug、capability_tags、vendor、context_window）
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ModelListItem } from '@/types/model'

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
        {/* 头部：分类 + 研发商 Logo */}
        <div className="flex items-center justify-between mb-3">
          {primaryCategory ? (
            <span className="px-3 py-1 text-[12px] text-[#666666] bg-[#F3F4F6] rounded-full">
              {primaryCategory.name}
            </span>
          ) : (
            <span />
          )}
          {/* 研发商 Logo */}
          {model.vendor.logo_url && (
            <div className="relative w-[42px] h-[42px] flex-shrink-0">
              <Image
                src={model.vendor.logo_url}
                alt={model.vendor.name}
                fill
                className="object-contain"
              />
            </div>
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

        {/* 底部：上下文窗口 */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex justify-between text-[13px] text-[#666666]">
            <div>
              <span className="text-[#9CA3AF]">上下文: </span>
              <span>{formatContextWindow(model.context_window)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ModelCard
