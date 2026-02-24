'use client'

import Link from 'next/link'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { useState } from 'react'
import type { ProductItem } from '@/types/cms'
import { useAuthStore } from '@/stores/auth'

interface ProductDetailClientProps {
  product: ProductItem
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([])
  const { isAuthenticated, hydrated } = useAuthStore()

  // 判断是否已登录
  const isLoggedIn = hydrated && isAuthenticated

  // 处理立即体验按钮点击
  const handleExperienceClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const targetUrl = isLoggedIn ? '/console/account/basic-information' : '/login'
    window.open(targetUrl, '_blank')
  }

  const toggleFaq = (faqId: string) => {
    setExpandedFaqs(prev =>
      prev.includes(faqId)
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    )
  }

  return (
    <main className="flex flex-col items-center w-full overflow-y-auto flex-1 pb-[160px] min-h-screen">
      {/* 1. 标题区域 */}
      <div className="px-[20px] lg:px-0 lg:w-[1000px] flex flex-col items-center mt-[80px]">
        {/* 主标题 */}
        <h1 className="m-0 p-0 text-center text-[#181E25] text-[54px] font-[500] leading-[86.4px] pb-[12px] max-w-[900px]">
          {product.name} - {product.tagline}
        </h1>

        {/* 日期 */}
        <div className="text-[#181E25] text-[14px] font-[400] leading-[21px] mb-[24px]">
          {product.createdAt || '2026-02-24'}
        </div>

        {/* CTA 按钮 */}
        <div className="flex items-center justify-center py-[16px]">
          {!hydrated ? (
            // hydration 未完成时显示占位按钮
            <div className="w-[140px] h-[48px] bg-gray-100 rounded-full animate-pulse mr-[16px]"></div>
          ) : (
            <button
              onClick={handleExperienceClick}
              className="no-underline p-[8px_24px] rounded-full flex items-center gap-2 bg-[#181E25] text-white mr-[16px] hover:opacity-90 transition-all duration-300"
            >
              <p className="p-0 m-0 text-[16px] font-[400] leading-[19px]">立即体验</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          )}
          <Link
            href={`/products/${product.slug || 'tierflow'}`}
            className="no-underline p-[8px_24px] rounded-full flex items-center gap-2 border border-solid border-[#181E25]/80 text-[#181E25] hover:bg-[#F7F8FA] transition-all duration-300"
          >
            <p className="p-0 m-0 text-[16px] font-[400] leading-[19px]">了解更多</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
              <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </Link>
        </div>
      </div>

      {/* 2. 核心数据展示 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[48px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {product.stats?.map((stat, index) => (
            <div key={index} className="text-center p-8 bg-[#F7F8FA] rounded-[12px]">
              <div className="text-[36px] font-[500] text-[#181E25] mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-[14px] text-[#666]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 产品简介 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px]">
        <p className="m-0 p-0 text-[#181E25] text-[18px] font-[300] leading-[32px] text-center mb-[48px]">
          {product.shortDescription}
        </p>
      </div>

      {/* 4. 核心能力 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[32px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">核心能力</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.highlights?.map((highlight, index) => (
            <div key={index} className="p-8 bg-[#F7F8FA] rounded-[16px] hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">{highlight.title}</h3>
                  <p className="text-[14px] text-[#666] leading-[24px]">{highlight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 使用场景 */}
      {product.useCases && product.useCases.length > 0 && (
        <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[48px]">
          <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">应用场景</h2>

          <div className="space-y-8">
            {product.useCases.map((useCase, index) => (
              <div key={index} className="bg-[#F7F8FA] rounded-[16px] p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#181E25] text-white text-[14px] rounded-full">
                    场景 {index + 1}
                  </span>
                </div>
                <h3 className="text-[24px] font-[500] text-[#181E25] mb-4">{useCase.title}</h3>
                <p className="text-[16px] text-[#666] leading-[28px] mb-6">{useCase.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {useCase.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#181E25] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[14px] text-[#181E25]">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. 详细内容 - Markdown */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
        <MarkdownRenderer content={product.content} className="prose" />
      </div>

      {/* 8. FAQ */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
          <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">常见问题</h2>

          <div className="space-y-4">
            {product.faqs.map((faq, index) => {
              const isExpanded = expandedFaqs.includes(faq.id)

              return (
                <div key={index} className="bg-[#F7F8FA] rounded-[12px] overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F0F1F2] transition-colors"
                  >
                    <span className="font-[500] text-[#181E25] pr-4">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-[#181E25] flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <p className="text-[15px] text-[#666] leading-[26px]">{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}
