'use client'

/**
 * 分类标签组件
 * 以标签栏形式展示分类，支持点击切换筛选
 * 使用 ModelCategory.key 作为筛选标识（适配新后端 API）
 */

import React from 'react'
import type { ModelCategory } from '@/types/model'

interface CategoryTabsProps {
  categories: ModelCategory[]
  selectedKey: string | null
  onChange: (key: string | null) => void
  labels?: {
    all?: string
  }
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedKey,
  onChange,
  labels,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* 全部标签 */}
      <button
        onClick={() => onChange(null)}
        className={`
          px-4 py-2 text-[14px] rounded-full transition-all duration-200
          ${
            selectedKey === null
              ? 'bg-[#181E25] text-white'
              : 'bg-[#F3F4F6] text-[#666666] hover:bg-[#E5E7EB]'
          }
        `}
      >
        {labels?.all || '全部'}
      </button>

      {/* 分类标签 */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.key)}
          className={`
            px-4 py-2 text-[14px] rounded-full transition-all duration-200
            ${
              selectedKey === category.key
                ? 'bg-[#181E25] text-white'
                : 'bg-[#F3F4F6] text-[#666666] hover:bg-[#E5E7EB]'
            }
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs
