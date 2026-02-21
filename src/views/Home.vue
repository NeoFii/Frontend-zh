<template>
  <div>
    <!-- 1. Hero Section - TierFlow 产品简介 -->
    <section class="relative min-h-[90vh] flex flex-col items-center justify-center bg-white pt-20 overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div class="relative container-custom py-12">
        <div class="max-w-5xl mx-auto text-center">
          <!-- 产品名称 - 超大标题 -->
          <h1 class="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-4 tracking-tight leading-none">
            TierFlow
          </h1>

          <!-- 产品副标题 -->
          <p class="text-2xl md:text-3xl text-gray-700 mb-4 font-medium">
            智能分层推理引擎
          </p>

          <!-- 产品描述 -->
          <p class="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            面向大模型应用的高性能推理优化平台，通过智能分层缓存与动态路由技术，
            将 AI 推理成本降低 70%，响应速度提升至毫秒级别
          </p>

          <!-- CTA 按钮 - 横向排列 -->
          <div class="flex flex-wrap gap-3 justify-center mb-10">
            <RouterLink to="/login" class="group inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300">
              即刻接入API
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </RouterLink>
            <RouterLink to="/products/1" class="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-900 rounded-full font-medium hover:bg-gray-200 transition-all duration-300">
              了解产品功能
            </RouterLink>
            <a href="https://neofii.github.io/TierFlow-Doc/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all duration-300">
              查看文档
              <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <!-- 核心数据指标 -->
          <div class="grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto">
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-gray-900 mb-1">70%</div>
              <div class="text-gray-500 text-sm">成本降低</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-gray-900 mb-1">50ms</div>
              <div class="text-gray-500 text-sm">平均响应</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-gray-900 mb-1">99.9%</div>
              <div class="text-gray-500 text-sm">服务可用性</div>
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- 2. 产品功能简介 -->
    <section id="features" class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="text-center mb-10">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">核心能力</h2>
          <p class="text-gray-600 max-w-xl mx-auto">
            三大核心技术，为您的 AI 应用提供极致性能与成本优化
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- 功能 1 -->
          <div class="group bg-white p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div class="w-12 h-12 mb-4 bg-gradient-to-br from-primary-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">智能分层缓存</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              基于语义相似度的多级缓存系统，自动识别重复查询，缓存命中率达 85%，显著降低 API 调用成本
            </p>
          </div>

          <!-- 功能 2 -->
          <div class="group bg-white p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div class="w-12 h-12 mb-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">动态模型路由</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              实时评估任务复杂度，智能选择最优模型组合，简单任务使用轻量模型，复杂任务自动升级至大模型
            </p>
          </div>

          <!-- 功能 3 -->
          <div class="group bg-white p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div class="w-12 h-12 mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">高可用架构</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              多节点冗余部署，自动故障转移，支持 10万+ QPS 并发，企业级 SLA 保障，确保业务连续性
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 榜单数据区 - 精简为实时性能监控 -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="text-center mb-8">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">实时性能监控</h2>
          <p class="text-gray-600">TierFlow 平台实时运行数据</p>
        </div>

        <!-- 性能对比图表 -->
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <div class="flex items-center space-x-4">
              <h3 class="font-semibold text-gray-900">吞吐性能坐标图</h3>
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span class="flex items-center">
                  <span class="w-3 h-3 bg-orange-400 rounded-sm mr-1.5"></span>
                  输入
                </span>
                <span class="flex items-center">
                  <span class="w-3 h-3 bg-blue-400 rounded-sm mr-1.5"></span>
                  输出
                </span>
              </div>
            </div>
            <span class="text-sm text-gray-500 flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              实时更新
            </span>
          </div>

          <!-- 图表区域 -->
          <div class="p-6 md:p-8">
            <div class="relative">
              <!-- Y轴标签 -->
              <div class="absolute -left-2 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-gray-400 text-right pr-2">
                <span>1k</span>
                <span>100</span>
                <span>10</span>
                <span>1</span>
              </div>

              <!-- 图表主体 -->
              <div class="ml-8 relative">
                <!-- Y轴标题 -->
                <div class="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500 font-medium whitespace-nowrap">
                  吞吐量 (tokens/s)
                </div>

                <!-- 网格背景 -->
                <div class="relative h-80 border-l border-b border-gray-300 bg-gradient-to-br from-orange-50/30 via-white to-blue-50/30">
                  <!-- 网格线 -->
                  <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div class="border-t border-gray-200 border-dashed w-full h-0"></div>
                    <div class="border-t border-gray-200 border-dashed w-full h-0"></div>
                    <div class="border-t border-gray-200 border-dashed w-full h-0"></div>
                    <div class="border-t border-gray-200 border-dashed w-full h-0"></div>
                  </div>

                  <!-- 垂直网格线 (对数刻度示意) -->
                  <div class="absolute inset-0 flex justify-between pointer-events-none px-8">
                    <div class="border-l border-gray-200 border-dashed h-full"></div>
                    <div class="border-l border-gray-200 border-dashed h-full"></div>
                    <div class="border-l border-gray-200 border-dashed h-full"></div>
                    <div class="border-l border-gray-200 border-dashed h-full"></div>
                  </div>

                  <!-- 数据点 -->
                  <!-- TierFlow - 最优位置 (低延迟, 高吞吐) -->
                  <div class="absolute" style="left: 15%; bottom: 85%;">
                    <div class="relative group cursor-pointer">
                      <div class="w-4 h-4 bg-orange-500 rounded-sm shadow-lg shadow-orange-500/30 transform hover:scale-125 transition-transform"></div>
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        TierFlow: 50ms, 850 tok/s
                      </div>
                    </div>
                    <div class="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-900 whitespace-nowrap">TierFlow</div>
                  </div>

                  <!-- OpenAI - 中等位置 -->
                  <div class="absolute" style="left: 35%; bottom: 55%;">
                    <div class="relative group cursor-pointer">
                      <div class="w-4 h-4 bg-orange-400 rounded-sm shadow-md transform hover:scale-125 transition-transform"></div>
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        OpenAI: 150ms, 350 tok/s
                      </div>
                    </div>
                    <div class="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">OpenAI</div>
                  </div>

                  <!-- Azure - 偏右下 -->
                  <div class="absolute" style="left: 55%; bottom: 40%;">
                    <div class="relative group cursor-pointer">
                      <div class="w-4 h-4 bg-blue-400 rounded-sm shadow-md transform hover:scale-125 transition-transform"></div>
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Azure: 280ms, 220 tok/s
                      </div>
                    </div>
                    <div class="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">Azure</div>
                  </div>

                  <!-- AWS - 右下角 -->
                  <div class="absolute" style="left: 75%; bottom: 25%;">
                    <div class="relative group cursor-pointer">
                      <div class="w-4 h-4 bg-blue-500 rounded-sm shadow-md transform hover:scale-125 transition-transform"></div>
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        AWS: 450ms, 120 tok/s
                      </div>
                    </div>
                    <div class="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">AWS</div>
                  </div>

                  <!-- 阿里云 - 中间位置 -->
                  <div class="absolute" style="left: 45%; bottom: 48%;">
                    <div class="relative group cursor-pointer">
                      <div class="w-4 h-4 bg-orange-300 rounded-sm shadow-md transform hover:scale-125 transition-transform"></div>
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        阿里云: 220ms, 280 tok/s
                      </div>
                    </div>
                    <div class="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">阿里云</div>
                  </div>

                  <!-- 腾讯云 - 偏右 -->
                  <div class="absolute" style="left: 65%; bottom: 35%;">
                    <div class="relative group cursor-pointer">
                      <div class="w-4 h-4 bg-blue-300 rounded-sm shadow-md transform hover:scale-125 transition-transform"></div>
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        腾讯云: 350ms, 180 tok/s
                      </div>
                    </div>
                    <div class="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">腾讯云</div>
                  </div>
                </div>

                <!-- X轴标签 -->
                <div class="flex justify-between mt-2 text-xs text-gray-400 px-8">
                  <span>10 ms</span>
                  <span>100 ms</span>
                  <span>1 s</span>
                  <span>10 s</span>
                  <span>1 min</span>
                </div>

                <!-- X轴标题 -->
                <div class="text-center mt-4 text-xs text-gray-500 font-medium">
                  延迟 Latency (对数坐标)
                </div>
              </div>
            </div>

            <!-- 图例说明 -->
            <div class="mt-6 pt-4 border-t border-gray-100 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div class="flex items-center">
                <span class="w-3 h-3 bg-orange-500 rounded-sm mr-2"></span>
                <span>最优性能区</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 bg-orange-400 rounded-sm mr-2"></span>
                <span>高性能区</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 bg-blue-400 rounded-sm mr-2"></span>
                <span>标准性能区</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 bg-blue-500 rounded-sm mr-2"></span>
                <span>基础性能区</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 简化首页，不需要复杂的 store 调用
</script>
