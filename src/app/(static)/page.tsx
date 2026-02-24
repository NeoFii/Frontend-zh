'use client'

import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import Reveal from '@/components/Reveal'
import CountUp from '@/components/CountUp'

// 客户端硬编码产品数据（避免使用 fs 模块）
const featuredProduct = {
  name: 'TierFlow',
  slug: 'tierflow',
  tagline: '智能分层推理引擎',
  shortDescription: '面向大模型应用的高性能推理优化平台',
  stats: [
    { label: '成本降低', value: '70', suffix: '%' },
    { label: '平均响应', value: '50', suffix: 'ms' },
    { label: '服务可用性', value: '99.9', suffix: '%' },
  ],
  highlights: [
    {
      id: '1',
      title: '智能分层缓存',
      description: '基于语义相似度的多级缓存系统，自动识别重复查询，缓存命中率达 85%，显著降低 API 调用成本',
    },
    {
      id: '2',
      title: '动态模型路由',
      description: '实时评估任务复杂度，智能选择最优模型组合，简单任务使用轻量模型，复杂任务自动升级至大模型',
    },
    {
      id: '3',
      title: '高可用架构',
      description: '多节点冗余部署，自动故障转移，支持 10万+ QPS 并发，企业级 SLA 保障，确保业务连续性',
    },
  ],
}

export default function Home() {
  const { isAuthenticated, hydrated } = useAuthStore()

  // 判断是否已登录（认证状态由后端通过 Cookie 管理）
  const isLoggedIn = hydrated && isAuthenticated

  return (
    <main>
      {/* 1. Hero Section - TierFlow 产品简介 */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-white pt-20 overflow-hidden">
        {/* 动态背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-[120px] animate-pulse-glow"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-orange-200/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-gradient-to-r from-primary-100/20 to-orange-100/20 rounded-full blur-[80px] animate-float"></div>
        </div>

        <div className="relative container-custom py-12">
          <div className="max-w-5xl mx-auto text-center">
            {/* 产品名称 - 超大标题 */}
            <Reveal>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 tracking-tight leading-none">
                {featuredProduct?.name || 'TierFlow'}
              </h1>
            </Reveal>

            {/* 产品副标题 */}
            <Reveal delay={100}>
              <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-medium">
                {featuredProduct?.tagline || '智能分层推理引擎'}
              </p>
            </Reveal>

            {/* 产品描述 */}
            <Reveal delay={200}>
              <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                {featuredProduct?.shortDescription || '面向大模型应用的高性能推理优化平台'}
              </p>
            </Reveal>

            {/* CTA 按钮 - 横向排列 */}
            <Reveal delay={300}>
              <div className="flex flex-wrap gap-4 justify-center mb-16">
                {isLoggedIn ? (
                  <a
                    href="/console/account/basic-information"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/20 btn-ripple"
                  >
                    进入控制台
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    href="/login"
                    className="group inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/20 btn-ripple"
                  >
                    即刻接入API
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                )}
                <Link
                  href={`/products/${featuredProduct.slug}`}
                  className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-900 rounded-full font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                >
                  了解产品功能
                </Link>
                <a
                  href="https://neofii.github.io/TierFlow-Doc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-105"
                >
                  查看文档
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </Reveal>

            {/* 核心数据指标 */}
            <Reveal delay={400}>
              <div className="grid grid-cols-3 gap-8 md:gap-16 max-w-3xl mx-auto">
                {featuredProduct.stats.slice(0, 3).map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      <CountUp end={parseFloat(stat.value)} suffix={stat.suffix} />
                    </div>
                    <div className="text-gray-500 text-sm md:text-base">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* 向下滚动提示 */}
        <Reveal delay={600}>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 2. 产品功能简介 */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">核心能力</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                三大核心技术，为您的 AI 应用提供极致性能与成本优化
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProduct.highlights.slice(0, 3).map((highlight, index) => {
              const gradients = [
                'from-primary-500 to-orange-600',
                'from-violet-500 to-purple-600',
                'from-emerald-500 to-teal-600'
              ]
              const shadows = [
                'shadow-primary-500/25',
                'shadow-violet-500/25',
                'shadow-emerald-500/25'
              ]
              const icons = [
                <svg key="1" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>,
                <svg key="2" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>,
                <svg key="3" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ]

              return (
                <Reveal key={highlight.id} delay={index * 100}>
                  <div className="group bg-white p-8 rounded-3xl card-hover border border-gray-100/50">
                    <div className={`w-14 h-14 mb-6 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl flex items-center justify-center shadow-lg ${shadows[index % shadows.length]} group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
                      {icons[index % icons.length]}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">{highlight.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. 实时性能监控 */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">实时性能监控</h2>
              <p className="text-gray-600 text-lg">TierFlow 平台实时运行数据</p>
            </div>
          </Reveal>

          {/* 性能对比图表 */}
          <Reveal delay={100}>
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-lg shadow-gray-100/50">
              <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center space-x-6">
                  <h3 className="font-semibold text-gray-900 text-lg">吞吐性能坐标图</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-orange-400 rounded-sm mr-2"></span>
                      输入
                    </span>
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-blue-400 rounded-sm mr-2"></span>
                      输出
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  实时更新
                </span>
              </div>

              {/* 图表区域 */}
              <div className="p-8 md:p-12">
                <div className="relative">
                  {/* Y轴标签 */}
                  <div className="absolute -left-2 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-gray-400 text-right pr-2">
                    <span>1k</span>
                    <span>100</span>
                    <span>10</span>
                    <span>1</span>
                  </div>

                  {/* 图表主体 */}
                  <div className="ml-8 relative">
                    {/* Y轴标题 */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500 font-medium whitespace-nowrap">
                      吞吐量 (tokens/s)
                    </div>

                    {/* 网格背景 */}
                    <div className="relative h-80 border-l border-b border-gray-200 bg-gradient-to-br from-orange-50/30 via-white to-blue-50/30">
                      {/* 网格线 */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        <div className="border-t border-gray-100 w-full h-0"></div>
                        <div className="border-t border-gray-100 w-full h-0"></div>
                        <div className="border-t border-gray-100 w-full h-0"></div>
                        <div className="border-t border-gray-100 w-full h-0"></div>
                      </div>

                      {/* 垂直网格线 */}
                      <div className="absolute inset-0 flex justify-between pointer-events-none px-8">
                        <div className="border-l border-gray-100 h-full"></div>
                        <div className="border-l border-gray-100 h-full"></div>
                        <div className="border-l border-gray-100 h-full"></div>
                        <div className="border-l border-gray-100 h-full"></div>
                      </div>

                      {/* 数据点 */}
                      <Reveal delay={300}>
                        <div className="absolute" style={{ left: '15%', bottom: '85%' }}>
                          <div className="relative group cursor-pointer">
                            <div className="w-5 h-5 bg-orange-500 rounded-sm shadow-lg shadow-orange-500/40 transform group-hover:scale-150 transition-transform duration-300"></div>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              TierFlow: 50ms, 850 tok/s
                            </div>
                          </div>
                          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-900 whitespace-nowrap">TierFlow</div>
                        </div>
                      </Reveal>

                      <Reveal delay={400}>
                        <div className="absolute" style={{ left: '35%', bottom: '55%' }}>
                          <div className="relative group cursor-pointer">
                            <div className="w-5 h-5 bg-orange-400 rounded-sm shadow-md transform group-hover:scale-150 transition-transform duration-300"></div>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              OpenAI: 150ms, 350 tok/s
                            </div>
                          </div>
                          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-sm text-gray-600 whitespace-nowrap">OpenAI</div>
                        </div>
                      </Reveal>

                      <Reveal delay={500}>
                        <div className="absolute" style={{ left: '55%', bottom: '40%' }}>
                          <div className="relative group cursor-pointer">
                            <div className="w-5 h-5 bg-blue-400 rounded-sm shadow-md transform group-hover:scale-150 transition-transform duration-300"></div>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              Azure: 280ms, 220 tok/s
                            </div>
                          </div>
                          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-sm text-gray-600 whitespace-nowrap">Azure</div>
                        </div>
                      </Reveal>

                      <Reveal delay={600}>
                        <div className="absolute" style={{ left: '75%', bottom: '25%' }}>
                          <div className="relative group cursor-pointer">
                            <div className="w-5 h-5 bg-blue-500 rounded-sm shadow-md transform group-hover:scale-150 transition-transform duration-300"></div>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              AWS: 450ms, 120 tok/s
                            </div>
                          </div>
                          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-sm text-gray-600 whitespace-nowrap">AWS</div>
                        </div>
                      </Reveal>
                    </div>

                    {/* X轴标签 */}
                    <div className="flex justify-between mt-4 text-xs text-gray-400 px-8">
                      <span>10 ms</span>
                      <span>100 ms</span>
                      <span>1 s</span>
                      <span>10 s</span>
                      <span>1 min</span>
                    </div>

                    {/* X轴标题 */}
                    <div className="text-center mt-4 text-sm text-gray-500 font-medium">
                      延迟 Latency (对数坐标)
                    </div>
                  </div>
                </div>

                {/* 图例说明 */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-orange-500 rounded-sm mr-3"></span>
                    <span>最优性能区</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-orange-400 rounded-sm mr-3"></span>
                    <span>高性能区</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-blue-400 rounded-sm mr-3"></span>
                    <span>标准性能区</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-blue-500 rounded-sm mr-3"></span>
                    <span>基础性能区</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
