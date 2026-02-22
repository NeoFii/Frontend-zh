'use client'

import Link from 'next/link'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { useState } from 'react'
import type { ProductItem } from '@/types/cms'

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
  bolt: (
    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'chart-bar': (
    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  'shield-check': (
    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  'chart-pie': (
    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  ),
  server: (
    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
}

function getIcon(iconName?: string) {
  if (!iconName) return iconMap.bolt
  return iconMap[iconName] || iconMap.bolt
}

interface ProductDetailClientProps {
  product: ProductItem
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([])

  const toggleFaq = (faqId: string) => {
    setExpandedFaqs(prev =>
      prev.includes(faqId)
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    )
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section - 简约白色 */}
      <section className="relative bg-white pt-24 pb-16 border-b border-gray-100">
        <div className="container-custom">
          {/* 面包屑 */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-900 transition-colors">首页</Link>
            <svg className="w-4 h-4 mx-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900">{product.name}</span>
          </div>

          {/* 主标题区 */}
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              {product.name}
            </h1>
            <p className="text-xl text-gray-500 mb-6 leading-relaxed">
              {product.tagline}
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* CTA 按钮组 */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                开始使用
              </Link>
              <button
                onClick={() => scrollToSection('features')}
                className="inline-flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                了解详情
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 核心数据 - 简约数字 */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {product.stats?.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-semibold text-gray-900 mb-1">
                  {stat.value}<span className="text-lg">{stat.suffix}</span>
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心能力 - 简洁列表 */}
      <section id="features" className="py-20">
        <div className="container-custom">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">核心能力</h2>
            <p className="text-gray-600">{product.fullDescription}</p>
          </div>

          {/* 能力列表 - 简洁网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.highlights?.map((highlight) => (
              <div key={highlight.id} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 flex items-center justify-center">
                  {getIcon(highlight.icon)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{highlight.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使用场景 - 左右布局 */}
      {product.useCases && product.useCases.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl font-semibold text-gray-900 mb-10">应用场景</h2>

            <div className="space-y-12">
              {product.useCases.map((useCase, index) => (
                <div
                  key={useCase.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span className="w-6 h-px bg-gray-300"></span>
                      场景 {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{useCase.description}</p>
                    <ul className="space-y-2">
                      {useCase.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 价格方案 - 简约表格 */}
      {product.pricing && (
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">价格方案</h2>
              <p className="text-gray-600">{product.pricing.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {product.pricing.plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white border border-gray-200 p-6 ${
                    plan.isRecommended ? 'border-gray-900' : ''
                  }`}
                >
                  {plan.isRecommended && (
                    <div className="text-xs text-gray-500 mb-2">推荐</div>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

                  <div className="mb-4">
                    <span className="text-3xl font-semibold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-500 text-sm">/{plan.period}</span>}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-2 text-sm font-medium border transition-colors ${
                      plan.isRecommended
                        ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {product.pricing.contactSales ? '联系销售' : '开始使用'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ - 手风琴 */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="py-20">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">常见问题</h2>

              <div className="space-y-4">
                {product.faqs.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-200 pb-4">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between text-left py-2"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <svg
                        className={`w-4 h-4 text-gray-400 transform transition-transform ${
                          expandedFaqs.includes(faq.id) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedFaqs.includes(faq.id) && (
                      <div className="pt-2 pb-2">
                        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 详细内容 - Markdown */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <MarkdownRenderer content={product.content} className="prose-gray" />
          </div>
        </div>
      </section>
    </div>
  )
}
