'use client'

import { useTranslations } from 'next-intl'

export default function PricePage() {
  const t = useTranslations('price')
  const freeFeatures = t.raw('free.features') as string[]
  const proFeatures = t.raw('pro.features') as string[]
  const enterpriseFeatures = t.raw('enterprise.features') as string[]

  return (
    <main className="flex flex-col items-center w-full overflow-y-auto flex-1 pb-[160px] min-h-screen">
      {/* 1. 标题区域 */}
      <div className="px-[20px] lg:px-0 lg:w-[1000px] flex flex-col items-center mt-[80px]">
        {/* 主标题 */}
        <h1 className="m-0 p-0 text-center text-[#181E25] text-[54px] font-[500] leading-[86.4px] pb-[12px] max-w-[900px]">
          {t('title')}
        </h1>

        {/* 副标题 */}
        <p className="text-[#181E25] text-[18px] font-[300] leading-[32px] text-center mb-[32px] max-w-[700px]">
          {t('subtitle')}
        </p>

        {/* 描述 */}
        <p className="text-[#666] text-[16px] font-[300] leading-[28px] text-center mb-[32px] max-w-[700px]">
          {t('description')}
        </p>
      </div>

      {/* 2. 价格方案 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[32px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 免费版 */}
          <div className="bg-[#F7F8FA] rounded-[16px] p-8">
            <div className="text-center">
              <h3 className="text-[24px] font-[500] text-[#181E25] mb-4">{t('free.name')}</h3>
              <div className="mb-6">
                <span className="text-[48px] font-[600] text-[#181E25]">{t('free.price')}</span>
                <span className="text-[16px] text-[#666]">{t('free.period')}</span>
              </div>
              <p className="text-[14px] text-[#666] mb-6">{t('free.description')}</p>
            </div>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature: string, index: number) => (
                <li key={index} className="flex items-center text-[14px] text-[#666]">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="/login"
              className="block w-full text-center py-3 bg-[#181E25] text-white rounded-full text-[16px] font-[400] hover:opacity-90 transition-all duration-300"
            >
              {t('free.cta')}
            </a>
          </div>

          {/* 专业版 */}
          <div className="bg-[#F7F8FA] rounded-[16px] p-8 border-2 border-primary-500 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-[14px] font-[500]">
              {t('pro.badge')}
            </div>
            <div className="text-center">
              <h3 className="text-[24px] font-[500] text-[#181E25] mb-4">{t('pro.name')}</h3>
              <div className="mb-6">
                <span className="text-[48px] font-[600] text-[#181E25]">{t('pro.price')}</span>
                <span className="text-[16px] text-[#666]">{t('pro.period')}</span>
              </div>
              <p className="text-[14px] text-[#666] mb-6">{t('pro.description')}</p>
            </div>
            <ul className="space-y-3 mb-8">
              {proFeatures.map((feature: string, index: number) => (
                <li key={index} className="flex items-center text-[14px] text-[#666]">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="/login"
              className="block w-full text-center py-3 bg-primary-500 text-white rounded-full text-[16px] font-[400] hover:opacity-90 transition-all duration-300"
            >
              {t('pro.cta')}
            </a>
          </div>

          {/* 企业版 */}
          <div className="bg-[#F7F8FA] rounded-[16px] p-8">
            <div className="text-center">
              <h3 className="text-[24px] font-[500] text-[#181E25] mb-4">{t('enterprise.name')}</h3>
              <div className="mb-6">
                <span className="text-[48px] font-[600] text-[#181E25]">{t('enterprise.price')}</span>
              </div>
              <p className="text-[14px] text-[#666] mb-6">{t('enterprise.description')}</p>
            </div>
            <ul className="space-y-3 mb-8">
              {enterpriseFeatures.map((feature: string, index: number) => (
                <li key={index} className="flex items-center text-[14px] text-[#666]">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="/contact"
              className="block w-full text-center py-3 bg-[#181E25] text-white rounded-full text-[16px] font-[400] hover:opacity-90 transition-all duration-300"
            >
              {t('enterprise.cta')}
            </a>
          </div>
        </div>
      </div>

      {/* 3. 计费方式 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">{t('billing.title')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-[#F7F8FA] rounded-[16px]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">{t('billing.payAsYouGo')}</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  {t('billing.payAsYouGoDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#F7F8FA] rounded-[16px]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">{t('billing.monthly')}</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  {t('billing.monthlyDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FAQ */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">{t('faq.title')}</h2>

        <div className="space-y-4">
          <div className="bg-[#F7F8FA] rounded-[16px] p-6">
            <h3 className="text-[16px] font-[500] text-[#181E25] mb-2">{t('faq.q1')}</h3>
            <p className="text-[14px] text-[#666] leading-[24px]">
              {t('faq.a1')}
            </p>
          </div>

          <div className="bg-[#F7F8FA] rounded-[16px] p-6">
            <h3 className="text-[16px] font-[500] text-[#181E25] mb-2">{t('faq.q2')}</h3>
            <p className="text-[14px] text-[#666] leading-[24px]">
              {t('faq.a2')}
            </p>
          </div>

          <div className="bg-[#F7F8FA] rounded-[16px] p-6">
            <h3 className="text-[16px] font-[500] text-[#181E25] mb-2">{t('faq.q3')}</h3>
            <p className="text-[14px] text-[#666] leading-[24px]">
              {t('faq.a3')}
            </p>
          </div>

          <div className="bg-[#F7F8FA] rounded-[16px] p-6">
            <h3 className="text-[16px] font-[500] text-[#181E25] mb-2">{t('faq.q4')}</h3>
            <p className="text-[14px] text-[#666] leading-[24px]">
              {t('faq.a4')}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
