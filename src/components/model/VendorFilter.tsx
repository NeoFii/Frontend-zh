'use client'

/**
 * 厂商筛选组件
 * 支持选择一个或多个厂商进行筛选
 */

import React from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { modelVendors } from '@/data/models'
import Image from 'next/image'

interface VendorFilterProps {
  selectedVendors: string[]
  onChange: (vendorIds: string[]) => void
  labels?: {
    vendorFilter: string
    clearFilter: string
    selectAll: string
    selectedVendors: string
  }
}

export const VendorFilter: React.FC<VendorFilterProps> = ({
  selectedVendors,
  onChange,
  labels,
}) => {
  const { t } = useTranslation('model')
  // 使用翻译作为默认值，支持外部传入 labels 覆盖
  const defaultLabels = {
    vendorFilter: t('vendorFilter'),
    clearFilter: t('clearVendorFilter'),
    selectAll: t('selectAll'),
    selectedVendors: t('selectedVendors'),
  }
  const mergedLabels = labels || defaultLabels

  const toggleVendor = (vendorId: string) => {
    if (selectedVendors.includes(vendorId)) {
      onChange(selectedVendors.filter((id) => id !== vendorId))
    } else {
      onChange([...selectedVendors, vendorId])
    }
  }

  const clearAll = () => {
    onChange([])
  }

  const selectAll = () => {
    onChange(modelVendors.map((v) => v.id))
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-medium text-[#181E25]">{mergedLabels.vendorFilter}</span>
        <div className="flex gap-2">
          {selectedVendors.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[13px] text-[#666666] hover:text-[#181E25] transition-colors"
            >
              {mergedLabels.clearFilter}
            </button>
          )}
          <button
            onClick={selectAll}
            className="text-[13px] text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
          >
            {mergedLabels.selectAll}
          </button>
        </div>
      </div>

      {/* 厂商标签列表 */}
      <div className="flex flex-wrap gap-2">
        {modelVendors.map((vendor) => {
          const isSelected = selectedVendors.includes(vendor.id)
          return (
            <button
              key={vendor.id}
              onClick={() => toggleVendor(vendor.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
                ${
                  isSelected
                    ? 'bg-gray-200 border-gray-400 text-[#181E25]'
                    : 'bg-white border-gray-200 text-[#666666] hover:border-gray-300'
                }
              `}
            >
              {/* 厂商图标 */}
              <div className="relative w-5 h-5 flex-shrink-0">
                <Image
                  src={`/icons/providers/${vendor.providerId}.png`}
                  alt={vendor.name}
                  fill
                  className="rounded object-cover"
                  onError={(e) => {
                    // 如果图片加载失败，显示首字母
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-bold rounded"
                  style={{
                    backgroundColor: vendor.color,
                    color: 'white',
                    display: 'none',
                  }}
                  id={`fallback-${vendor.id}`}
                >
                  {vendor.name.charAt(0)}
                </div>
              </div>
              <span className="text-[13px]">{vendor.name}</span>
            </button>
          )
        })}
      </div>

      {/* 已选数量提示 */}
      {selectedVendors.length > 0 && (
        <div className="mt-3 text-[13px] text-[#666666]">
          {mergedLabels.selectedVendors.replace('{count}', String(selectedVendors.length))}
        </div>
      )}
    </div>
  )
}

export default VendorFilter
