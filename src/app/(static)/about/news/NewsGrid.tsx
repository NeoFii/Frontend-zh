'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// 新闻数据类型（API 返回格式）
type NewsItem = {
  slug: string
  title: string
  date: string
  category: string
  coverImage?: string
  content: string
}

interface NewsGridProps {
  newsList: NewsItem[]
}

const INITIAL_COUNT = 6
const LOAD_MORE_COUNT = 6

export default function NewsGrid({ newsList }: NewsGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)

  const visibleNews = newsList.slice(0, visibleCount)
  const hasMore = visibleCount < newsList.length

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + LOAD_MORE_COUNT)
  }

  // --- 空状态 (Empty State) 设计升级 ---
  if (newsList.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white/50 backdrop-blur-md px-6 py-20 text-center shadow-sm">
        {/* 背景光晕 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-50 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-50 to-violet-50 text-blue-600 shadow-inner border border-blue-100/50">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="relative z-10 mb-3 text-2xl font-bold text-slate-900 tracking-tight">暂时还没有新闻哦</h3>
        <p className="relative z-10 mx-auto max-w-xl text-base leading-relaxed text-slate-500">
          我们正在准备最新动态、产品更新和行业内容。稍后再来看看，这里会第一时间展示新的新闻内容。
        </p>
      </div>
    )
  }

  return (
    <>
      {/* --- 新闻网格 (News Grid) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleNews.map((news) => (
          <article
            key={news.slug}
            className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
          >
            <Link href={`/about/news/${news.slug}`} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">

              {/* 封面图区域 */}
              <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                {/* 悬浮时的遮罩加深效果 */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

                {news.coverImage ? (
                  <Image
                    src={news.coverImage}
                    alt={news.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  // 缺失封面时的品牌科技风回退图
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <svg className="w-16 h-16 text-white/50 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 内容区域 */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  {/* 分类 Tag */}
                  <span className="px-3 py-1 bg-blue-50/80 text-blue-600 border border-blue-100/50 text-xs rounded-full font-semibold tracking-wide shadow-sm">
                    {news.category}
                  </span>
                  {/* 日期 */}
                  <div className="flex items-center text-xs text-slate-400 font-medium">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {news.date}
                  </div>
                </div>

                {/* 标题 */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-snug tracking-tight">
                  {news.title}
                </h3>

                {/* 阅读全文引导 (Hover时显现) */}
                <div className="mt-auto pt-6 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  阅读全文
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* --- 加载更多按钮 --- */}
      {hasMore && (
        <div className="mt-14 text-center">
          <button
            onClick={handleLoadMore}
            className="group inline-flex items-center px-8 py-3.5 bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm text-slate-700 rounded-2xl font-semibold hover:bg-white hover:border-blue-300 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
          >
            加载更多
            <svg className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}