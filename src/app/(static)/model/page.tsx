'use client'

/**
 * 模型页面
 * 展示所有支持的 AI 模型，以网格卡片形式呈现
 * 对接后端 Testing 服务 API
 */

import React, { useState, useMemo } from 'react'
import useSWR from 'swr'
import { getModels, getCategories } from '@/lib/api/model'
import type { ModelListItem, Category } from '@/types/model'
import CategoryTabs from '@/components/model/CategoryTabs'
import ModelSearch from '@/components/model/ModelSearch'
import ModelCardV2 from '@/components/model/ModelCardV2'

// 搜索过滤
function useModelSearch(models: ModelListItem[], query: string): ModelListItem[] {
  return useMemo(() => {
    if (!query.trim()) return models

    const q = query.toLowerCase().trim()
    return models.filter(
      (model) =>
        model.name.toLowerCase().includes(q) ||
        model.model_id.toLowerCase().includes(q) ||
        model.description?.toLowerCase().includes(q)
    )
  }, [models, query])
}

export default function ModelPage() {
  // 状态管理
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // 获取分类列表
  const { data: categories = [] } = useSWR<Category[]>(
    'categories',
    () => getCategories()
  )

  // 获取模型列表
  const { data: modelsData, isLoading } = useSWR(
    selectedCategory ? ['models', selectedCategory] : 'models',
    () =>
      getModels({
        category: selectedCategory || undefined,
        page: 1,
        page_size: 100,
      })
  )

  const models = modelsData?.items || []

  // 搜索过滤
  const filteredModels = useModelSearch(models, searchQuery)

  // 清除筛选
  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
  }

  const hasActiveFilters = searchQuery || selectedCategory

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
          selectedSlug={selectedCategory}
          onChange={setSelectedCategory}
          labels={{ all: '全部' }}
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
            {isLoading ? '加载中...' : `${filteredModels.length} 个模型`}
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
        ) : filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {filteredModels.map((model) => (
              <ModelCardV2 key={model.id} model={model} />
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
