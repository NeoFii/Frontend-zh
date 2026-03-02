'use client'

/**
 * 模型卡片组件
 * 展示单个模型的卡片信息
 */

import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Model, ModelVendor } from '@/data/models'

interface ModelCardProps {
  model: Model
  vendor: ModelVendor
}

// 备用图标组件
const FallbackIcon: React.FC<{ name: string; color: string; size: number }> = ({
  name,
  color,
  size,
}) => {
  const initial = name.charAt(0)

  return (
    <div
      className="rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.35,
      }}
    >
      {initial}
    </div>
  )
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, vendor }) => {
  const [imgError, setImgError] = React.useState(false)

  return (
    <Link href={`/model/${model.id}`} className="block">
      <div className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full">
      {/* 头部：供应商信息 + 对话标签 */}
      <div className="flex items-center justify-between mb-3">
        {/* 供应商标识 */}
        <div className="flex items-center gap-2">
          {imgError ? (
            <FallbackIcon name={vendor.name} color={vendor.color} size={32} />
          ) : (
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src={`/icons/providers/${vendor.providerId}.png`}
                alt={vendor.name}
                fill
                className="rounded-lg object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          )}
          <span className="text-[14px] text-[#666666] truncate">
            {vendor.name}
          </span>
        </div>

        {/* 对话标签 */}
        {model.type && (
          <span className="px-3 py-1 text-[12px] text-[#666666] bg-[#F3F4F6] rounded-full">
            {model.type}
          </span>
        )}
      </div>

      {/* 模型名称 */}
      <h3 className="text-[16px] font-semibold text-[#181E25] mb-1 line-clamp-2 leading-tight">
        {model.name}
      </h3>

      {/* 发布时间 */}
      {model.publishedAt && (
        <p className="text-[13px] text-[#9CA3AF] mb-3">
          {formatDate(model.publishedAt)}
        </p>
      )}

      {/* 能力标签 */}
      {model.capabilities && model.capabilities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {model.capabilities.slice(0, 3).map((capability) => (
            <span
              key={capability}
              className="px-2.5 py-1 text-[11px] font-medium text-[#4B5563] rounded-full border border-transparent bg-gradient-to-r from-[#2563EB]/10 to-[#8B5CF6]/10"
              style={{
                borderImage: 'linear-gradient(to right, #2563EB, #8B5CF6) 1',
                borderImageSlice: '1',
                border: '1px solid transparent',
                background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #2563EB, #8B5CF6) border-box',
              }}
            >
              {capability}
            </span>
          ))}
        </div>
      )}

      {/* 价格信息 */}
      {model.pricing && (
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex justify-between text-[13px]">
            <div>
              <span className="text-[#9CA3AF]">输入:</span>
              <span className="text-[#666666] ml-1">{model.pricing.input}</span>
            </div>
            <div>
              <span className="text-[#9CA3AF]">输出:</span>
              <span className="text-[#666666] ml-1">{model.pricing.output}</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </Link>
  )
}

export default ModelCard
