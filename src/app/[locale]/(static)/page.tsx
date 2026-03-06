'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Reveal from '@/components/Reveal'
import { useAuthStore } from '@/stores/auth'
import Image from 'next/image'

const BASE_URL = 'https://api.eucal.ai/v1/chat/completions'

// 支持的供应商 Logo（使用本地图标）
const providers = [
  { name: 'OpenAI', icon: '/icons/providers/openai.png' },
  { name: 'Claude', icon: '/icons/providers/anthropic.png' },
  { name: 'Gemini', icon: '/icons/providers/gemini.png' },
  { name: '智谱', icon: '/icons/providers/zhipu.png' },
  { name: 'DeepSeek', icon: '/icons/providers/deepseek.png' },
  { name: 'Kimi', icon: '/icons/providers/moonshot.png' },
  { name: '通义千问', icon: '/icons/providers/qwen.png' },
  { name: '百川', icon: '/icons/providers/cornerstone.png' },
  { name: 'MiniMax', icon: '/icons/providers/minimax.png' },
  { name: '阶跃星辰', icon: '/icons/providers/stepfun.png' },
  { name: '硅基流动', icon: '/icons/providers/silicon-flow.png' },
  { name: 'Llama', icon: '/icons/providers/meta.png' },
]

export default function Home() {
  const t = useTranslations('home')
  const { isAuthenticated, hydrated } = useAuthStore()
  const isLoggedIn = hydrated && isAuthenticated
  const [copied, setCopied] = useState(false)

  // 处理 CTA 按钮点击
  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const targetUrl = isLoggedIn ? '/console/account/basic-information' : '/login'
    window.open(targetUrl, '_blank')
  }

  // 复制 BASE URL
  const copyBaseUrl = () => {
    navigator.clipboard.writeText(BASE_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center bg-[#FAF8F5] pt-16 overflow-hidden">
        {/* 渐变模糊球体背景 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[100px] animate-pulse-glow"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-teal-400/20 rounded-full blur-[90px] animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-[40%] right-[25%] w-[250px] h-[250px] bg-orange-300/15 rounded-full blur-[70px] animate-float"></div>
        </div>

        {/* 装饰性花括号 */}
        <div className="absolute top-[8%] left-[5%] text-[150px] md:text-[220px] font-light text-gray-900/[0.03] select-none pointer-events-none">
          {'{'}
        </div>
        <div className="absolute bottom-[8%] right-[5%] text-[150px] md:text-[220px] font-light text-gray-900/[0.03] select-none pointer-events-none">
          {'}'}
        </div>

        <div className="relative container-custom py-12 z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* 主标题 */}
            <Reveal>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
                {t('hero.title')}
                <br />
                <span className="text-gradient">{t('hero.titleHighlight')}</span>
              </h1>
            </Reveal>

            {/* 副标题 */}
            <Reveal delay={100}>
              <p className="text-lg md:text-xl text-gray-600/90 mb-8 max-w-xl mx-auto leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </Reveal>

            {/* BASE URL 展示 */}
            <Reveal delay={200}>
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl px-5 py-3 mb-8 shadow-sm">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('baseUrl.label')}</span>
                <span className="text-sm font-mono text-gray-800">{BASE_URL}</span>
                <button
                  onClick={copyBaseUrl}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title={copied ? t('baseUrl.copied') : t('baseUrl.copyTitle')}
                >
                  {copied ? (
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </Reveal>

            {/* CTA 按钮 */}
            <Reveal delay={400}>
              <div className="flex flex-wrap gap-4 justify-center items-center mb-16">
                <button
                  onClick={handleCtaClick}
                  className="group inline-flex items-center px-8 py-3.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all duration-300 hover:shadow-lg hover:shadow-primary-600/25 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t('cta.getKey')}
                </button>
                <a
                  href="https://neofii.github.io/TierFlow-Doc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-8 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('cta.docs')}
                </a>
              </div>
            </Reveal>

            {/* 供应商 Logo 区域 */}
            <Reveal delay={500}>
              <div className="w-full">
                <p className="text-base md:text-lg text-gray-500 mb-6 font-light">
                  {t('providers.title')}
                </p>
                {/* 无限滚动 Logo */}
                <div className="relative overflow-hidden max-w-4xl mx-auto">
                  <div className="flex animate-marquee">
                    {/* 第一组 Logo */}
                    {providers.map((provider, index) => (
                      <div
                        key={`first-${index}`}
                        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 mx-4 md:mx-6 flex-shrink-0"
                        title={provider.name}
                      >
                        <Image
                          src={provider.icon}
                          alt={provider.name}
                          width={48}
                          height={48}
                          className="object-contain w-full h-full opacity-70 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                    {/* 第二组 Logo（复制用于无缝滚动） */}
                    {providers.map((provider, index) => (
                      <div
                        key={`second-${index}`}
                        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 mx-4 md:mx-6 flex-shrink-0"
                        title={provider.name}
                      >
                        <Image
                          src={provider.icon}
                          alt={provider.name}
                          width={48}
                          height={48}
                          className="object-contain w-full h-full opacity-70 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                    {/* 第三组 Logo（复制用于无缝滚动） */}
                    {providers.map((provider, index) => (
                      <div
                        key={`third-${index}`}
                        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 mx-4 md:mx-6 flex-shrink-0"
                        title={provider.name}
                      >
                        <Image
                          src={provider.icon}
                          alt={provider.name}
                          width={48}
                          height={48}
                          className="object-contain w-full h-full opacity-70 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 向下滚动提示 */}
        <Reveal delay={700}>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
