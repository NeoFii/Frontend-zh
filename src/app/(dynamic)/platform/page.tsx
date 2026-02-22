import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '开放平台',
}

export default function Platform() {
  return (
    <div className="animate-fade-in">
      <section className="relative bg-white pt-24 pb-16 border-b border-gray-100">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-6">
              开发者中心
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              Eucal AI 开放平台
            </h1>
            <p className="text-xl text-gray-500 mb-6 leading-relaxed">
              通过简洁的 API 接口，快速接入 TierFlow 的智能推理优化能力
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed max-w-2xl">
              我们提供与 OpenAI 兼容的 API 格式，支持多种编程语言的 SDK，让您在几分钟内完成接入，即刻享受 70% 的成本降低和毫秒级响应速度。
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="https://neofii.github.io/TierFlow-Doc/" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center px-6 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                查看 API 文档
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <Link href="/login" className="inline-flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors">
                获取 API Key
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">为什么选择我们的开放平台</h2>
            <p className="text-gray-600">极简接入，强大功能，为企业级应用提供稳定可靠的推理优化服务</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">OpenAI 兼容</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  完全兼容 OpenAI API 格式，只需修改 base_url 和 api_key，现有代码无需任何改动即可接入
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">多语言 SDK</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  提供 Python、Node.js、Go、Java 等多种语言的官方 SDK，集成更简单，开发更高效
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
