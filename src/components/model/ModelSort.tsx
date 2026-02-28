'use client'

/**
 * 模型排序组件
 * 支持按默认排序和倒序排列
 */

import React, { useState } from 'react'

export type SortOrder = 'default' | 'desc' | 'asc'

interface ModelSortProps {
  value: SortOrder
  onChange: (value: SortOrder) => void
}

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'default', label: '按默认排序' },
  { value: 'desc', label: '发布时间倒序' },
  { value: 'asc', label: '发布时间正序' },
]

export const ModelSort: React.FC<ModelSortProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = sortOptions.find((opt) => opt.value === value)

  const handleSelect = (sortValue: SortOrder) => {
    onChange(sortValue)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[14px] text-[#181E25] hover:border-gray-300 transition-colors"
      >
        <span>{selectedOption?.label || '按默认排序'}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* 下拉菜单 */}
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2.5 text-left text-[14px] transition-colors ${
                  value === option.value
                    ? 'bg-[#F3F4F6] text-[#181E25] font-medium'
                    : 'text-[#666666] hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ModelSort
