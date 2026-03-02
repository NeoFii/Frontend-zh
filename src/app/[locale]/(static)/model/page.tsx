'use client'

/**
 * 模型页面
 * 展示所有支持的 AI 模型，以网格卡片形式呈现
 */

import React, { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { modelVendors, ModelVendor, Model } from '@/data/models'
import ModelSearch from '@/components/model/ModelSearch'
import ModelSort, { SortOrder } from '@/components/model/ModelSort'
import ModelCard from '@/components/model/ModelCard'
import VendorFilter from '@/components/model/VendorFilter'

export default function ModelPage() {
  const t = useTranslations('model')
  // 状态管理
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('default')
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])

  // 获取所有模型并关联供应商
  const allModels = useMemo(() => {
    const models: { model: Model; vendor: ModelVendor }[] = []
    modelVendors.forEach((vendor) => {
      vendor.models.forEach((model) => {
        models.push({ model, vendor })
      })
    })
    return models
  }, [])

  // 过滤和排序模型
  const filteredModels = useMemo(() => {
    let result = [...allModels]

    // 厂商筛选
    if (selectedVendors.length > 0) {
      result = result.filter(({ vendor }) =>
        selectedVendors.includes(vendor.id)
      )
    }

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        ({ model, vendor }) =>
          model.name.toLowerCase().includes(query) ||
          model.description?.toLowerCase().includes(query) ||
          vendor.name.toLowerCase().includes(query)
      )
    }

    // 排序
    if (sortOrder === 'desc') {
      result.sort((a, b) => {
        const dateA = a.model.publishedAt ? new Date(a.model.publishedAt).getTime() : 0
        const dateB = b.model.publishedAt ? new Date(b.model.publishedAt).getTime() : 0
        return dateB - dateA
      })
    } else if (sortOrder === 'asc') {
      result.sort((a, b) => {
        const dateA = a.model.publishedAt ? new Date(a.model.publishedAt).getTime() : 0
        const dateB = b.model.publishedAt ? new Date(b.model.publishedAt).getTime() : 0
        return dateA - dateB
      })
    }

    return result
  }, [allModels, searchQuery, sortOrder, selectedVendors])

  // 清除所有筛选
  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedVendors([])
  }

  // 是否有活跃筛选
  const hasActiveFilters = searchQuery || selectedVendors.length > 0

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* 标题区域 */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[24px] lg:text-[28px] font-semibold text-[#181E25] mb-2">
              {t('title')}
            </h1>
            <p className="text-[14px] text-[#666666]">
              {t('description')}
            </p>
          </div>

          {/* 排序控件 */}
          <ModelSort value={sortOrder} onChange={setSortOrder} />
        </div>

        {/* 厂商筛选 */}
        <VendorFilter
          selectedVendors={selectedVendors}
          onChange={setSelectedVendors}
        />

        {/* 搜索栏 */}
        <div className="mb-6">
          <div className="max-w-md">
            <ModelSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* 结果统计 */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-[14px] text-[#666666]">
            {t('resultCount', { count: filteredModels.length })}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-[13px] text-[#666666] hover:text-[#181E25] transition-colors flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M11 3.5L3 11.5M3 3.5L11 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t('clearFilters')}
            </button>
          )}
        </div>

        {/* 模型网格 */}
        {filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {filteredModels.map(({ model, vendor }) => (
              <ModelCard key={model.id} model={model} vendor={vendor} />
            ))}
          </div>
        ) : (
          /* 无结果提示 */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              className="text-[#E5E7EB] mb-4"
            >
              <path
                d="M56 56M8 8L28 28M36 28L56 8M28 36L8 56"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="28"
                cy="28"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
              />
              <circle cx="36" cy="36" r="4" fill="currentColor" />
            </svg>
            <p className="text-[16px] text-[#666666]">{t('noResults')}</p>
            <p className="text-[14px] text-[#9CA3AF] mt-1">
              {t('tryAdjust')}
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-[#181E25] text-white text-[14px] rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('clearFilters')}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
