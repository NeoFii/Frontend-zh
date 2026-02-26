'use client'

export default function PricePage() {
  return (
    <main className="flex flex-col items-center w-full overflow-y-auto flex-1 pb-[160px] min-h-screen">
      {/* 1. 标题区域 */}
      <div className="px-[20px] lg:px-0 lg:w-[1000px] flex flex-col items-center mt-[80px]">
        {/* 主标题 */}
        <h1 className="m-0 p-0 text-center text-[#181E25] text-[54px] font-[500] leading-[86.4px] pb-[12px] max-w-[900px]">
          透明定价
        </h1>

        {/* 副标题 */}
        <p className="text-[#181E25] text-[18px] font-[300] leading-[32px] text-center mb-[32px] max-w-[700px]">
          按需付费，灵活选择，为您提供最具性价比的 AI 服务
        </p>

        {/* 描述 */}
        <p className="text-[#666] text-[16px] font-[300] leading-[28px] text-center mb-[32px] max-w-[700px]">
          我们提供竞争力的定价，让您以更低的成本获得高质量的 AI 能力。企业用户还可享受批量折扣和定制方案。
        </p>
      </div>

      {/* 2. 价格方案 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[32px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 免费版 */}
          <div className="bg-[#F7F8FA] rounded-[16px] p-8">
            <div className="text-center">
              <h3 className="text-[24px] font-[500] text-[#181E25] mb-4">免费版</h3>
              <div className="mb-6">
                <span className="text-[48px] font-[600] text-[#181E25]">¥0</span>
                <span className="text-[16px] text-[#666]">/月</span>
              </div>
              <p className="text-[14px] text-[#666] mb-6">适合个人开发者和测试使用</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                每月 1,000 次 API 调用
              </li>
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                支持基础模型
              </li>
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                标准响应速度
              </li>
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                社区支持
              </li>
            </ul>
            <a
              href="/login"
              className="block w-full text-center py-3 bg-[#181E25] text-white rounded-full text-[16px] font-[400] hover:opacity-90 transition-all duration-300"
            >
              立即开始
            </a>
          </div>

          {/* 专业版 */}
          <div className="bg-[#F7F8FA] rounded-[16px] p-8 border-2 border-primary-500 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-[14px] font-[500]">
              最受欢迎
            </div>
            <div className="text-center">
              <h3 className="text-[24px] font-[500] text-[#181E25] mb-4">专业版</h3>
              <div className="mb-6">
                <span className="text-[48px] font-[600] text-[#181E25]">¥99</span>
                <span className="text-[16px] text-[#666]">/月</span>
              </div>
              <p className="text-[14px] text-[#666] mb-6">适合个人开发者和小型团队</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                每月 100,000 次 API 调用
              </li>
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                支持全部模型
              </li>
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                优先响应速度
              </li>
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                邮件支持
              </li>
            </ul>
            <a
              href="/login"
              className="block w-full text-center py-3 bg-primary-500 text-white rounded-full text-[16px] font-[400] hover:opacity-90 transition-all duration-300"
            >
              立即升级
            </a>
          </div>

          {/* 企业版 */}
          <div className="bg-[#F7F8FA] rounded-[16px] p-8">
            <div className="text-center">
              <h3 className="text-[24px] font-[500] text-[#181E25] mb-4">企业版</h3>
              <div className="mb-6">
                <span className="text-[48px] font-[600] text-[#181E25]">定制</span>
              </div>
              <p className="text-[14px] text-[#666] mb-6">适合大型企业和高并发场景</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                无限 API 调用
              </li>
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                专属模型定制
              </li>
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                超低延迟响应
              </li>
              <li className="flex items-center text-[14px] text-[#666]">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                7×24 专属客服
              </li>
            </ul>
            <a
              href="/contact"
              className="block w-full text-center py-3 bg-[#181E25] text-white rounded-full text-[16px] font-[400] hover:opacity-90 transition-all duration-300"
            >
              联系销售
            </a>
          </div>
        </div>
      </div>

      {/* 3. 计费方式 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">计费方式</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-[#F7F8FA] rounded-[16px]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">按量付费</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  根据实际使用量计费，无固定月费，适合使用量不稳定的场景。按 token 计费，价格透明。
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
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">包月套餐</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  固定月费，享受更低单价，适合稳定使用的企业用户。套餐内 API 调用可累计使用。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FAQ */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">常见问题</h2>

        <div className="space-y-4">
          <div className="bg-[#F7F8FA] rounded-[16px] p-6">
            <h3 className="text-[16px] font-[500] text-[#181E25] mb-2">如何选择适合自己的方案？</h3>
            <p className="text-[14px] text-[#666] leading-[24px]">
              如果您是个人开发者或仅用于测试，建议先使用免费版。如果您的项目需要上线运营，建议选择专业版或企业版以获得更好的服务支持。
            </p>
          </div>

          <div className="bg-[#F7F8FA] rounded-[16px] p-6">
            <h3 className="text-[16px] font-[500] text-[#181E25] mb-2">如何查看我的使用量？</h3>
            <p className="text-[14px] text-[#666] leading-[24px]">
              登录控制台后，您可以在"账户管理"页面查看详细的 API 调用统计和使用量报表。
            </p>
          </div>

          <div className="bg-[#F7F8FA] rounded-[16px] p-6">
            <h3 className="text-[16px] font-[500] text-[#181E25] mb-2">是否支持退款？</h3>
            <p className="text-[14px] text-[#666] leading-[24px]">
              我们提供 7 天无理由退款服务。如果您对服务不满意，可以在购买后 7 天内申请全额退款。
            </p>
          </div>

          <div className="bg-[#F7F8FA] rounded-[16px] p-6">
            <h3 className="text-[16px] font-[500] text-[#181E25] mb-2">企业版有哪些专属服务？</h3>
            <p className="text-[14px] text-[#666] leading-[24px]">
              企业版用户可享受专属客服、SLA 服务保障、定制化模型训练、优先技术支持等多项专属服务。
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
