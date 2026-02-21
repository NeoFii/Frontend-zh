<template>
  <div>
    <!-- Hero Section - 简洁聚焦设计 -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      <!-- 动态背景 -->
      <div class="absolute inset-0">
        <!-- 网格装饰 -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
        <!-- 渐变光晕 -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-3xl"></div>
        <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-2xl"></div>
      </div>

      <div class="relative container-custom py-20">
        <div class="max-w-4xl mx-auto text-center">
          <!-- 产品标签 -->
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
            <span class="w-2 h-2 bg-primary-400 rounded-full animate-pulse mr-2"></span>
            <span class="text-sm text-primary-300 font-medium">企业级 AI 智能平台</span>
          </div>

          <!-- 核心价值主张 -->
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            一个平台<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-violet-400 to-primary-400">无限智能可能</span>
          </h1>

          <!-- 产品描述 -->
          <p class="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Eucal AI 为企业提供统一的人工智能接入平台，让大模型调用更简单、更经济、更可靠
          </p>

          <!-- CTA 按钮 -->
          <div class="flex flex-wrap gap-4 justify-center mb-16">
            <RouterLink to="/contact" class="group inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-600/25 hover:scale-105">
              开始免费试用
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </RouterLink>
            <RouterLink to="/products" class="inline-flex items-center px-8 py-4 bg-white/5 backdrop-blur-sm text-white rounded-full font-semibold border border-white/10 hover:bg-white/10 transition-all duration-300">
              查看产品文档
            </RouterLink>
          </div>

          <!-- 核心数据指标 -->
          <div class="grid grid-cols-3 gap-8 md:gap-16 pt-8 border-t border-white/10">
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold text-white mb-2">
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400">70%</span>
              </div>
              <div class="text-sm md:text-base text-gray-500">成本降低</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold text-white mb-2">
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400">50ms</span>
              </div>
              <div class="text-sm md:text-base text-gray-500">平均响应</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold text-white mb-2">
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400">99.9%</span>
              </div>
              <div class="text-sm md:text-base text-gray-500">服务可用性</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 产品核心价值 - 简洁三列 -->
    <section class="py-24 bg-white">
      <div class="container-custom">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">产品优势</span>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">为什么选择 Eucal AI</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="group text-center p-8 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
            <div class="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">智能路由</h3>
            <p class="text-gray-600 leading-relaxed">
              根据任务类型、成本预算、响应速度自动选择最优模型，实现性能与成本的最佳平衡
            </p>
          </div>

          <div class="group text-center p-8 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
            <div class="w-16 h-16 mx-auto mb-6 bg-violet-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">成本优化</h3>
            <p class="text-gray-600 leading-relaxed">
              统一计费管理，智能流量分配，相比直接调用模型 API 平均节省 70% 成本
            </p>
          </div>

          <div class="group text-center p-8 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
            <div class="w-16 h-16 mx-auto mb-6 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">稳定可靠</h3>
            <p class="text-gray-600 leading-relaxed">
              多模型冗余备份，自动故障切换，99.9% 服务可用性保障，企业级 SLA 支持
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 支持的模型平台 -->
    <section class="py-20 bg-slate-50">
      <div class="container-custom">
        <p class="text-center text-gray-500 mb-8">兼容主流大模型平台</p>
        <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
          <div class="flex items-center gap-2 text-xl font-bold text-gray-700">
            <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm">O</div>
            OpenAI
          </div>
          <div class="flex items-center gap-2 text-xl font-bold text-gray-700">
            <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">A</div>
            Anthropic
          </div>
          <div class="flex items-center gap-2 text-xl font-bold text-gray-700">
            <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm">C</div>
            Cohere
          </div>
          <div class="flex items-center gap-2 text-xl font-bold text-gray-700">
            <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm">B</div>
            百度文心
          </div>
          <div class="flex items-center gap-2 text-xl font-bold text-gray-700">
            <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm">A</div>
            阿里通义
          </div>
        </div>
      </div>
    </section>

    <!-- 简单功能展示 -->
    <section class="py-24 bg-white">
      <div class="container-custom">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="inline-block px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">功能特性</span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              一站式 AI 能力接入
            </h2>
            <p class="text-lg text-gray-600 mb-8">
              无需对接多个模型供应商，通过 Eucal AI 统一 API 即可访问全球顶尖大模型，简化开发流程，降低技术门槛。
            </p>
            <ul class="space-y-4">
              <li class="flex items-center gap-3">
                <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-gray-700">统一 API 接口，一次接入，多模型切换</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-gray-700">智能缓存机制，重复请求零成本</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-gray-700">实时用量监控，成本透明可控</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-gray-700">企业级安全防护，数据隐私保障</span>
              </li>
            </ul>
          </div>
          <div class="relative">
            <div class="bg-slate-900 rounded-2xl p-6 shadow-2xl">
              <div class="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <span class="ml-2 text-sm text-gray-500">example.js</span>
              </div>
              <pre class="text-sm text-gray-300 overflow-x-auto"><code>import { EucalAI } from '@eucal/ai';

const client = new EucalAI({
  apiKey: 'your-api-key'
});

// 智能路由，自动选择最优模型
const response = await client.chat({
  messages: [{
    role: 'user',
    content: '分析这份销售数据'
  }],
  // 自动根据成本和性能选择模型
  strategy: 'balanced'
});

console.log(response.content);</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 简洁 CTA -->
    <section class="py-24 bg-slate-950">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          准备好接入 AI 了吗？
        </h2>
        <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          立即开始免费试用，体验更智能、更经济的 AI 接入方案
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <RouterLink to="/contact" class="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-600/25">
            免费开始使用
            <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </RouterLink>
          <a href="tel:400-888-8888" class="inline-flex items-center px-8 py-4 bg-white/5 text-white rounded-full font-semibold border border-white/10 hover:bg-white/10 transition-colors">
            联系销售团队
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 简化首页，不需要复杂的 store 调用
</script>
