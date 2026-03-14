'use client'

/**
 * 厂商筛选组件
 * 通过 vendors prop 接收研发商列表（由父组件通过 API 获取），支持多选筛选
 */

import React from 'react'
import Image from 'next/image'
import type { ModelVendor } from '@/types/model'

interface VendorFilterProps {
  /** 研发商列表（由父组件 getVendors() 获取后传入） */
  vendors: ModelVendor[]
  /** 已选中的研发商 slug 列表 */
  selectedVendors: string[]
  onChange: (vendorSlugs: string[]) => void
}

export const VendorFilter: React.FC<VendorFilterProps> = ({
  vendors,
  selectedVendors,
  onChange,
}) => {
  const toggleVendor = (slug: string) => {
    if (selectedVendors.includes(slug)) {
      onChange(selectedVendors.filter((s) => s !== slug))
    } else {
      onChange([...selectedVendors, slug])
    }
  }

  const clearAll = () => onChange([])
  const selectAll = () => onChange(vendors.map((v) => v.slug))

  if (vendors.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-medium text-[#181E25]">研发商</span>
        <div className="flex gap-2">
          {selectedVendors.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[13px] text-[#666666] hover:text-[#181E25] transition-colors"
            >
              清除
            </button>
          )}
          <button
            onClick={selectAll}
            className="text-[13px] text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
          >
            全选
          </button>
        </div>
      </div>

      {/* 研发商标签列表 */}
      <div className="flex flex-wrap gap-2">
        {vendors.map((vendor) => {
          const isSelected = selectedVendors.includes(vendor.slug)
          return (
            <button
              key={vendor.slug}
              onClick={() => toggleVendor(vendor.slug)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
                ${
                  isSelected
                    ? 'bg-gray-200 border-gray-400 text-[#181E25]'
                    : 'bg-white border-gray-200 text-[#666666] hover:border-gray-300'
                }
              `}
            >
              {/* 研发商 Logo */}
              {vendor.logo_url && (
                <div className="relative w-5 h-5 flex-shrink-0">
                  <Image
                    src={vendor.logo_url}
                    alt={vendor.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className="text-[13px]">{vendor.name}</span>
            </button>
          )
        })}
      </div>

      {/* 已选数量提示 */}
      {selectedVendors.length > 0 && (
        <div className="mt-3 text-[13px] text-[#666666]">
          已选 {selectedVendors.length} 个研发商
        </div>
      )}
    </div>
  )
}

export default VendorFilter
