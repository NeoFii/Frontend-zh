'use client'

/**
 * 模型搜索组件
 * 搜索框用于过滤模型
 */

import React from 'react'

interface ModelSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const ModelSearch: React.FC<ModelSearchProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="relative w-full max-w-md">
      {/* 搜索图标 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]/60"
      >
        <path
          d="M16.5 16.5L12.5 12.5M14.1667 8.33333C14.1667 11.095 11.9282 13.3333 9.16667 13.3333C6.40514 13.3333 4.16667 11.095 4.16667 8.33333C4.16667 5.57181 6.40514 3.33333 9.16667 3.33333C11.9282 3.33333 14.1667 5.57181 14.1667 8.33333Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 输入框 */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索模型名称"
        className="w-full h-10 pl-9 pr-4 bg-white border border-gray-200 rounded-lg text-[14px] text-[#181E25] placeholder:text-[#9CA3AF] focus:outline-none focus:border-gray-300 focus:ring-0 transition-colors"
      />

      {/* 清除按钮 */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default ModelSearch
