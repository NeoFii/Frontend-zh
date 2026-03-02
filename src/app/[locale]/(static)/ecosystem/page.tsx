'use client'

import { useTranslations } from 'next-intl'

export default function EcosystemPage() {
  const t = useTranslations('ecosystem')

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

        {/* CTA 按钮 */}
        <div className="flex items-center justify-center py-[16px]">
          <a
            href="mailto:partnership@example.com"
            className="no-underline p-[8px_24px] rounded-full flex items-center gap-2 bg-[#181E25] text-white mr-[16px] hover:opacity-90 transition-all duration-300"
          >
            <p className="p-0 m-0 text-[16px] font-[400] leading-[19px]">{t('cta')}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
              <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* 2. 合作伙伴展示 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[32px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">{t('partners')}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center justify-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[24px] font-[600] text-[#666]">{t('partnerA')}</div>
          </div>
          <div className="flex items-center justify-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[24px] font-[600] text-[#666]">{t('partnerB')}</div>
          </div>
          <div className="flex items-center justify-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[24px] font-[600] text-[#666]">{t('partnerC')}</div>
          </div>
          <div className="flex items-center justify-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[24px] font-[600] text-[#666]">{t('partnerD')}</div>
          </div>
        </div>
      </div>

      {/* 3. 合作方式 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[32px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">{t('cooperation')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-[#F7F8FA] rounded-[16px] hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">{t('technical')}</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  {t('technicalDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#F7F8FA] rounded-[16px] hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">{t('channel')}</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  {t('channelDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#F7F8FA] rounded-[16px] hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">{t('solution')}</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  {t('solutionDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#F7F8FA] rounded-[16px] hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">{t('strategic')}</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  {t('strategicDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 合作伙伴权益 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">{t('benefits')}</h2>

        <div className="bg-[#F7F8FA] rounded-[16px] p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">{t('benefit1')}</h3>
                <p className="text-[14px] text-[#666] mt-1">{t('benefit1Desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">{t('benefit2')}</h3>
                <p className="text-[14px] text-[#666] mt-1">{t('benefit2Desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">{t('benefit3')}</h3>
                <p className="text-[14px] text-[#666] mt-1">{t('benefit3Desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">{t('benefit4')}</h3>
                <p className="text-[14px] text-[#666] mt-1">{t('benefit4Desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">{t('benefit5')}</h3>
                <p className="text-[14px] text-[#666] mt-1">{t('benefit5Desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">{t('benefit6')}</h3>
                <p className="text-[14px] text-[#666] mt-1">{t('benefit6Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 联系我们 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">{t('contact')}</h2>

        <div className="text-center">
          <p className="text-[16px] text-[#666] mb-8">
            {t('contactDesc')}
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="mailto:partnership@example.com"
              className="no-underline px-8 py-3 rounded-full flex items-center gap-2 bg-[#181E25] text-white hover:opacity-90 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="p-0 m-0 text-[16px] font-[400]">partnership@example.com</p>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
