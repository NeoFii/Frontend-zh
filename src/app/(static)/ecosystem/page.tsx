'use client'

export default function EcosystemPage() {
  return (
    <main className="flex flex-col items-center w-full overflow-y-auto flex-1 pb-[160px] min-h-screen">
      {/* 1. 标题区域 */}
      <div className="px-[20px] lg:px-0 lg:w-[1000px] flex flex-col items-center mt-[80px]">
        {/* 主标题 */}
        <h1 className="m-0 p-0 text-center text-[#181E25] text-[54px] font-[500] leading-[86.4px] pb-[12px] max-w-[900px]">
          生态合作
        </h1>

        {/* 副标题 */}
        <p className="text-[#181E25] text-[18px] font-[300] leading-[32px] text-center mb-[32px] max-w-[700px]">
          携手共建 AI 生态，共创智能未来
        </p>

        {/* 描述 */}
        <p className="text-[#666] text-[16px] font-[300] leading-[28px] text-center mb-[32px] max-w-[700px]">
          我们致力于与合作伙伴共同构建开放的 AI 生态系统，为开发者和企业提供更丰富、更强大的 AI 能力。
        </p>

        {/* CTA 按钮 */}
        <div className="flex items-center justify-center py-[16px]">
          <a
            href="mailto:partnership@example.com"
            className="no-underline p-[8px_24px] rounded-full flex items-center gap-2 bg-[#181E25] text-white mr-[16px] hover:opacity-90 transition-all duration-300"
          >
            <p className="p-0 m-0 text-[16px] font-[400] leading-[19px]">成为合作伙伴</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
              <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* 2. 合作伙伴展示 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[32px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">合作伙伴</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center justify-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[24px] font-[600] text-[#666]">合作伙伴 A</div>
          </div>
          <div className="flex items-center justify-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[24px] font-[600] text-[#666]">合作伙伴 B</div>
          </div>
          <div className="flex items-center justify-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[24px] font-[600] text-[#666]">合作伙伴 C</div>
          </div>
          <div className="flex items-center justify-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[24px] font-[600] text-[#666]">合作伙伴 D</div>
          </div>
        </div>
      </div>

      {/* 3. 合作方式 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[32px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">合作方式</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-[#F7F8FA] rounded-[16px] hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">技术合作</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  与技术合作伙伴共同研发创新解决方案，整合双方技术优势，为客户提供更完善的 AI 产品和服务。
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
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">渠道合作</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  招募区域代理商和渠道合作伙伴，共同开拓市场，提供有竞争力的佣金政策和市场支持。
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
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">解决方案合作</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  与行业解决方案提供商合作，共同打造垂直行业的 AI 应用解决方案，满足特定行业需求。
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
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">战略合作</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  与战略合作伙伴建立深度合作关系，共同探索 AI 技术前沿，开展联合研发和市场推广。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 合作伙伴权益 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">合作伙伴权益</h2>

        <div className="bg-[#F7F8FA] rounded-[16px] p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">专属技术支持</h3>
                <p className="text-[14px] text-[#666] mt-1">获得专业技术团队的一对一支持</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">优惠价格政策</h3>
                <p className="text-[14px] text-[#666] mt-1">享受合作伙伴专属价格优惠</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">市场推广支持</h3>
                <p className="text-[14px] text-[#666] mt-1">联合举办市场活动，共同推广</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">产品优先体验</h3>
                <p className="text-[14px] text-[#666] mt-1">优先体验新功能和新产品</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">培训与赋能</h3>
                <p className="text-[14px] text-[#666] mt-1">定期产品培训和技术交流</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-[16px] font-[500] text-[#181E25]">商业机会共享</h3>
                <p className="text-[14px] text-[#666] mt-1">优先获得客户推荐和商业机会</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 联系我们 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">联系我们</h2>

        <div className="text-center">
          <p className="text-[16px] text-[#666] mb-8">
            欢迎有意向的合作伙伴与我们联系，共同探索合作机会
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
