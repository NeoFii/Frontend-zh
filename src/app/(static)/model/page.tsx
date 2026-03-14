'use client'

/**
 * 模型页面
 * 展示所有支持的 AI 模型，以网格卡片形式呈现
 * 支持分类 Tab、研发商多选、关键词搜索（均通过后端 API 过滤）
 */

import React, { useState } from 'react'
import useSWR from 'swr'
import { getModels, getCategories, getVendors } from '@/lib/api/testing-model'
import type { ModelCategory, ModelVendor } from '@/types/model'
import CategoryTabs from '@/components/model/CategoryTabs'
import ModelSearch from '@/components/model/ModelSearch'
import ModelCardV2 from '@/components/model/ModelCardV2'
import VendorFilter from '@/components/model/VendorFilter'

export default function ModelPage() {
  // 筛选状态
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])

  // 获取分类列表（静态数据，不受筛选影响）
  const { data: categories = [] } = useSWR<ModelCategory[]>(
    'categories',
    () => getCategories()
  )

  // 获取研发商列表（静态数据，不受筛选影响）
  const { data: vendors = [] } = useSWR<ModelVendor[]>(
    'vendors',
    () => getVendors()
  )

  // 获取模型列表（随所有筛选条件变化而重新请求）
  const swrKey = ['models', selectedCategory, selectedVendors.join(','), searchQuery]
  const { data: modelsData, isLoading } = useSWR(
    swrKey,
    () =>
      getModels({
        category: selectedCategory || undefined,
        vendors: selectedVendors.length > 0 ? selectedVendors : undefined,
        q: searchQuery || undefined,
        page: 1,
        page_size: 100,
      })
  )

  const models = modelsData?.items || []
  const hasActiveFilters = searchQuery || selectedCategory || selectedVendors.length > 0

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedVendors([])
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* 标题区域 */}
        <div className="mb-8">
          <h1 className="text-[24px] lg:text-[28px] font-semibold text-[#181E25] mb-2">
            AI 模型
          </h1>
          <p className="text-[14px] text-[#666666]">
            探索我们支持的所有 AI 模型，按分类筛选找到最适合您需求的模型
          </p>
        </div>

        {/* 分类标签 */}
        <CategoryTabs
          categories={categories}
          selectedKey={selectedCategory}
          onChange={setSelectedCategory}
          labels={{ all: '全部' }}
        />

        {/* 研发商筛选 */}
        <VendorFilter
          vendors={vendors}
          selectedVendors={selectedVendors}
          onChange={setSelectedVendors}
        />

        {/* 搜索栏 */}
        <div className="mb-6">
          <div className="max-w-md">
            <ModelSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="搜索模型名称或描述..."
            />
          </div>
        </div>

        {/* 结果统计 */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-[14px] text-[#666666]">
            {isLoading ? '加载中...' : `${models.length} 个模型`}
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
              清除筛选
            </button>
          )}
        </div>

        {/* 模型网格 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#181E25]" />
          </div>
        ) : models.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {models.map((model) => (
              <ModelCardV2 key={model.slug} model={model} />
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
            <p className="text-[16px] text-[#666666]">没有找到匹配的模型</p>
            <p className="text-[14px] text-[#9CA3AF] mt-1">试试调整筛选条件</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-[#181E25] text-white text-[14px] rounded-lg hover:opacity-90 transition-opacity"
            >
              清除筛选
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
