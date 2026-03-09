'use client'

/**
 * 模型卡片组件（新版）
 * 适配后端 API 返回的数据结构
 */

import React from 'react'
import Link from 'next/link'
import type { ModelListItem } from '@/types/model'

interface ModelCardProps {
  model: ModelListItem
  labels?: {
    input?: string
    output?: string
    providers?: string
  }
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

export const ModelCard: React.FC<ModelCardProps> = ({ model, labels }) => {
  return (
    <Link href={`/model/${model.model_id}`} className="block">
      <div className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full">
        {/* 头部：分类信息 */}
        <div className="flex items-center justify-between mb-3">
          {model.category && (
            <span className="px-3 py-1 text-[12px] text-[#666666] bg-[#F3F4F6] rounded-full">
              {model.category.name}
            </span>
          )}
          {model.is_open_source && (
            <span className="px-2 py-0.5 text-[10px] text-[#059669] bg-[#D1FAE5] rounded">
              开源
            </span>
          )}
        </div>

        {/* 模型名称 */}
        <h3 className="text-[16px] font-semibold text-[#181E25] mb-1 line-clamp-2 leading-tight">
          {model.name}
        </h3>

        {/* 模型 ID */}
        <p className="text-[12px] text-[#9CA3AF] mb-3 font-mono">
          {model.model_id}
        </p>

        {/* 描述 */}
        {model.description && (
          <p className="text-[13px] text-[#666666] mb-3 line-clamp-2 flex-grow">
            {model.description}
          </p>
        )}

        {/* 标签 */}
        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {model.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] text-[#4B5563] bg-[#F3F4F6] rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 底部信息 */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex justify-between text-[13px] text-[#666666]">
            <div>
              <span className="text-[#9CA3AF]">上下文: </span>
              <span>{formatContextLength(model.context_length)}</span>
            </div>
            <div>
              <span className="text-[#9CA3AF">{labels?.providers || '供应商'}: </span>
              <span>{model.provider_count}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ModelCard
