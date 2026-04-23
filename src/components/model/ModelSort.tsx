'use client'

/**
 * 模型排序组件
 * 支持按默认排序和倒序排列
 */

import React from 'react'
import { Select } from '@/components/ui/Select'

export type SortOrder = 'default' | 'desc' | 'asc'

interface ModelSortProps {
  value: SortOrder
  onChange: (value: SortOrder) => void
  labels?: {
    default: string
    newestDesc: string
    newestAsc: string
  }
}

export const ModelSort: React.FC<ModelSortProps> = ({ value, onChange, labels }) => {
  const sortLabels = labels || {
    default: '按默认排序',
    newestDesc: '发布时间倒序',
    newestAsc: '发布时间正序',
  }

  const sortOptions: { value: SortOrder; label: string }[] = [
    { value: 'default', label: sortLabels.default },
    { value: 'desc', label: sortLabels.newestDesc },
    { value: 'asc', label: sortLabels.newestAsc },
  ]

  return (
    <Select
      value={value}
      onChange={(nextValue) => onChange(nextValue as SortOrder)}
      options={sortOptions}
      className="inline-block"
      triggerClassName="rounded-lg border-gray-200 px-4 py-2 text-[14px] text-[#181E25] hover:border-gray-300"
      menuClassName="w-40 overflow-hidden rounded-lg border-gray-200"
      optionClassName="px-4 py-2.5 text-[14px]"
      selectedOptionClassName="bg-[#F3F4F6] text-[#181E25] font-medium"
      unselectedOptionClassName="text-[#666666] hover:bg-gray-50"
      menuAlign="right"
      fullWidth={false}
      matchTriggerWidth={false}
    />
  )
}

export default ModelSort
