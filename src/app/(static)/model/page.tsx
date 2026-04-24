'use client'

/**
 * 模型页面
 * 展示所有支持的 AI 模型，以网格卡片形式呈现
 * 支持分类 Tab、研发商多选、关键词搜索（均通过后端 API 过滤）
 */

import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { getModels, getCategories, getVendors } from '@/lib/api/testing-model'
import type { ModelCategory, ModelVendor } from '@/types/model'
import CategoryTabs from '@/components/model/CategoryTabs'
import ModelSearch from '@/components/model/ModelSearch'
import ModelCard from '@/components/model/ModelCard'
import VendorFilter from '@/components/model/VendorFilter'

// 定义进入动画的 Tailwind 类组合
const animationClasses = {
  container: 'transition-all duration-1000 ease-out',
  hidden: 'opacity-0 translate-y-8',
  visible: 'opacity-100 translate-y-0',
}

export default function ModelPage() {
  // 筛选状态
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])

  // 用于触发页面进入动画的状态
  const [isLoaded, setIsLoaded] = useState(false)

  // 页面加载后触发动画
  useEffect(() => {
    setIsLoaded(true)
  }, [])

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
  const totalModels = modelsData?.total ?? models.length
  const hasActiveFilters = searchQuery || selectedCategory || selectedVendors.length > 0

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedVendors([])
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans text-[#181E25] pb-16">
      <div className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-0 py-10">
          <div className="inline-flex rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-[13px] font-medium text-[#4B5563]">
            {totalModels} 个模型 · {vendors.length} 家厂商
          </div>
          <h1 className="mt-5 text-[32px] font-semibold leading-tight text-[#181E25]">
            TierFlow 支持的模型
          </h1>
          <p className="mt-3 max-w-[720px] text-[15px] leading-7 text-[#4B5563]">
            调度器会在这些模型中选择最合适的一个。你也可以在代码里显式指定模型，获得稳定的上下文窗口、能力标签和价格展示。
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-0 pt-8 flex flex-col">

        {/* --- 1. 核心控制面板 (Filter Control Panel) --- */}
        <div className={`w-full bg-white border border-[#E5E7EB] rounded-lg p-5 md:p-6 mb-8 ${animationClasses.container} ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-200`}>
          <div className="flex flex-col gap-6">

            {/* 上半部分：分类 Tab 与 搜索框 */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-full xl:w-auto flex-1 overflow-x-auto pb-2 xl:pb-0">
                <CategoryTabs
                  categories={categories}
                  selectedKey={selectedCategory}
                  onChange={setSelectedCategory}
                  labels={{ all: '全部模型' }}
                />
              </div>
              <div className="w-full xl:w-80 shrink-0">
                <ModelSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="搜索模型名称或能力..."
                />
              </div>
            </div>

            {/* 下半部分：研发商筛选 */}
            <div className="w-full">
              <div className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-3 ml-1">
              </div>
              <VendorFilter
                vendors={vendors}
                selectedVendors={selectedVendors}
                onChange={setSelectedVendors}
              />
            </div>

          </div>
        </div>

        {/* --- 2. 结果统计与操作 (Results Stats & Actions) --- */}
        <div className={`flex items-center justify-between mb-6 px-2 ${animationClasses.container} ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-300`}>
          <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
            {isLoading ? (
              <span className="flex items-center gap-2 text-blue-600">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在检索模型...
              </span>
            ) : (
              <>
                共找到 <span className="text-slate-900 font-bold text-base px-0.5">{models.length}</span> 个可用模型
              </>
            )}
          </div>

          {/* 清除筛选按钮 */}
          <div className={`transition-opacity duration-300 ${hasActiveFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button
              onClick={clearAllFilters}
              className="group flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-slate-500 bg-white/60 hover:bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm rounded-full transition-all duration-300 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:rotate-90 transition-transform duration-300">
                <path d="M11 3.5L3 11.5M3 3.5L11 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              清除筛选
            </button>
          </div>
        </div>

        {/* --- 3. 模型网格展示区 (Model Grid / Empty State) --- */}
        <div className={`${animationClasses.container} ${isLoaded ? animationClasses.visible : animationClasses.hidden} delay-500`}>
          {isLoading ? (
            // 加载中占位
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative flex justify-center items-center">
                <div className="absolute animate-ping w-12 h-12 rounded-full bg-blue-400 opacity-20"></div>
                <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-400 text-sm mt-4 font-medium tracking-wide">模型数据加载中...</p>
            </div>
          ) : models.length > 0 ? (
            // 网格列表
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {models.map((model) => (
                <ModelCard key={model.slug} model={model} />
              ))}
            </div>
          ) : (
            // 无结果空状态 (Empty State)
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-dashed border-slate-300 rounded-lg">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-slate-50 text-slate-400 shadow-inner border border-slate-200/80">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 64 64" fill="none">
                  <path d="M56 56M8 8L28 28M36 28L56 8M28 36L8 56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="28" cy="28" r="20" stroke="currentColor" strokeWidth="4" />
                  <circle cx="36" cy="36" r="5" fill="currentColor" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">没有找到匹配的模型</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                当前筛选组合下未找到任何模型。您可以尝试减少筛选条件或更换搜索关键词。
              </p>

              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-slate-800 hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                重置所有筛选
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
