'use client'

import { useState } from 'react'
import type { NewsItem } from '@/types'
import NewsGrid from './news/NewsGrid'

type TabType = 'about' | 'news'

const coreValues = [
  {
    title: '客户至上',
    description: '始终以客户需求为中心，提供超越期望的服务体验，建立长期信任的合作关系',
    bgColor: 'bg-rose-100 group-hover:bg-rose-200',
    iconColor: 'text-rose-600',
  },
  {
    title: '创新驱动',
    description: '持续探索前沿 AI 技术，为客户带来行业领先的智能化解决方案',
    bgColor: 'bg-amber-100 group-hover:bg-amber-200',
    iconColor: 'text-amber-600',
  },
  {
    title: '诚信正直',
    description: '以诚信为本，数据真实透明，算法公平可解释，建立值得信赖的 AI 产品',
    bgColor: 'bg-emerald-100 group-hover:bg-emerald-200',
    iconColor: 'text-emerald-600',
  },
  {
    title: '协作共赢',
    description: '与客户、合作伙伴携手并进，共同推动 AI 技术落地应用，共创美好未来',
    bgColor: 'bg-blue-100 group-hover:bg-blue-200',
    iconColor: 'text-blue-600',
  },
]

interface AboutClientProps {
  newsList: NewsItem[]
}

export default function AboutClient({ newsList }: AboutClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('about')

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="relative bg-white pt-24 pb-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">引领 AI 创新</h1>
            <p className="text-lg text-gray-600">我们致力于将前沿人工智能技术转化为实际的商业价值，为企业智能化转型提供强劲动力</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('about')}
                className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                  activeTab === 'about'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                关于我们
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                  activeTab === 'news'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                新闻动态
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'about' ? (
        <>
          {/* Company Intro */}
          <section className="py-12 bg-gray-50">
            <div className="container-custom">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">专注于 AI 技术创新</h2>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    Eucal AI 成立于2026年，是一家专注于人工智能技术研发与应用的创新型科技公司。我们致力于将前沿的 AI 技术转化为实际的商业价值，为企业提供智能化的解决方案。
                  </p>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    我们的团队由来自全球顶尖高校和科技公司的 AI 专家组成，在机器学习，自然语言处理，计算机视觉等领域拥有深厚的技术积累。
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">1</div>
                      <div className="text-gray-500 text-xs">年行业经验</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">500+</div>
                      <div className="text-gray-500 text-xs">企业客户</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">200+</div>
                      <div className="text-gray-500 text-xs">AI 专家</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">50+</div>
                      <div className="text-gray-500 text-xs">核心专利</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500/10 to-orange-500/10 border border-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/20">
                        <span className="text-4xl font-bold text-white">E</span>
                      </div>
                      <div className="text-gray-900 font-bold text-xl mb-1">Eucal AI</div>
                      <div className="text-gray-500 text-sm">智能 · 创新 · 未来</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vision & Mission */}
          <section className="py-12 bg-white">
            <div className="container-custom">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">驱动智能变革</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-2xl text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">我们的愿景</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      成为全球领先的 AI 技术提供商，用人工智能赋能千行百业，让智能技术惠及每一个人。
                    </p>
                  </div>
                </div>

                <div className="relative bg-gray-900 p-8 rounded-2xl text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">我们的使命</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      以创新的 AI 技术和专业的服务，帮助客户解决复杂问题，创造智能化的未来。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="py-12 bg-gray-50">
            <div className="container-custom">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">核心价值观</h2>
                <p className="text-gray-600 text-sm">指导我们日常工作的行为准则和文化基石</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {coreValues.map((value) => (
                  <div
                    key={value.title}
                    className="group relative bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${value.bgColor}`}>
                      <ValueIcon name={value.title} className={`w-6 h-6 ${value.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        /* News Tab Content */
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <NewsGrid newsList={newsList} />
          </div>
        </section>
      )}
    </div>
  )
}

function ValueIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case '客户至上':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    case '创新驱动':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    case '诚信正直':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.29 9.824 10 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case '协作共赢':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    default:
      return null
  }
}
