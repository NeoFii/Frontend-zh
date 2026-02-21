<template>
  <div class="animate-fade-in">
    <!-- Hero 区域 -->
    <section class="relative bg-white pt-24 pb-16 border-b border-gray-100">
      <div class="container-custom">
        <div class="max-w-3xl">
          <div class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-6">
            开发者中心
          </div>
          <h1 class="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
            Eucal AI 开放平台
          </h1>
          <p class="text-xl text-gray-500 mb-6 leading-relaxed">
            通过简洁的 API 接口，快速接入 TierFlow 的智能推理优化能力
          </p>
          <p class="text-gray-600 mb-8 leading-relaxed max-w-2xl">
            我们提供与 OpenAI 兼容的 API 格式，支持多种编程语言的 SDK，让您在几分钟内完成接入，即刻享受 70% 的成本降低和毫秒级响应速度。
          </p>

          <!-- CTA 按钮组 -->
          <div class="flex flex-wrap gap-3">
            <a href="https://neofii.github.io/TierFlow-Doc/" target="_blank" rel="noopener noreferrer"
               class="inline-flex items-center px-6 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
              查看 API 文档
              <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <RouterLink to="/login" class="inline-flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors">
              获取 API Key
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心特性 -->
    <section class="py-20">
      <div class="container-custom">
        <div class="max-w-2xl mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-3">为什么选择我们的开放平台</h2>
          <p class="text-gray-600">极简接入，强大功能，为企业级应用提供稳定可靠的推理优化服务</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-gray-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">OpenAI 兼容</h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                完全兼容 OpenAI API 格式，只需修改 base_url 和 api_key，现有代码无需任何改动即可接入
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-gray-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">多语言 SDK</h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                提供 Python、Node.js、Go、Java 等多种语言的官方 SDK，集成更简单，开发更高效
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-gray-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">企业级安全</h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                端到端加密传输，细粒度的 API 密钥管理，支持 IP 白名单和请求频率限制
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-gray-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">实时监控</h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                详细的调用日志、性能指标和成本分析，帮助您全面了解 API 使用情况
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 快速接入代码示例 -->
    <section class="py-20 bg-gray-50">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-3">5 分钟快速接入</h2>
            <p class="text-gray-600 mb-8">只需三步，即可开始使用 TierFlow 优化您的 AI 推理</p>

            <div class="space-y-6">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <h3 class="font-medium text-gray-900 mb-1">注册并获取 API Key</h3>
                  <p class="text-sm text-gray-600">创建账户，在控制台中生成您的专属 API Key</p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <h3 class="font-medium text-gray-900 mb-1">安装 SDK</h3>
                  <p class="text-sm text-gray-600">通过 pip、npm 等包管理器安装对应语言的 SDK</p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <h3 class="font-medium text-gray-900 mb-1">修改配置并开始调用</h3>
                  <p class="text-sm text-gray-600">将 base_url 指向 TierFlow  endpoint，保持原有代码逻辑不变</p>
                </div>
              </div>
            </div>

            <div class="mt-8">
              <RouterLink to="/login" class="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                立即开始
                <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </RouterLink>
            </div>
          </div>

          <!-- 代码示例 -->
          <div class="bg-gray-900 rounded-lg overflow-hidden">
            <div class="flex items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div class="flex space-x-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span class="ml-4 text-sm text-gray-400">example.py</span>
            </div>
            <div class="p-6 overflow-x-auto">
              <pre class="text-sm text-gray-300 font-mono leading-relaxed"><code><span class="text-purple-400">import</span> openai

<span class="text-gray-500"># 配置 TierFlow API</span>
openai.api_base = <span class="text-green-400">"https://api.tierflow.com/v1"</span>
openai.api_key = <span class="text-green-400">"your-api-key"</span>

<span class="text-gray-500"># 调用与 OpenAI 完全兼容</span>
response = openai.ChatCompletion.create(
    model=<span class="text-green-400">"gpt-3.5-turbo"</span>,
    messages=[{
        <span class="text-green-400">"role"</span>: <span class="text-green-400">"user"</span>,
        <span class="text-green-400">"content"</span>: <span class="text-green-400">"Hello, TierFlow!"</span>
    }]
)

<span class="text-purple-400">print</span>(response.choices[0].message.content)</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 开发者资源 -->
    <section class="py-20">
      <div class="container-custom">
        <div class="max-w-2xl mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-3">开发者资源</h2>
          <p class="text-gray-600">全面的文档和工具，助力您快速上手</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="https://neofii.github.io/TierFlow-Doc/" target="_blank" rel="noopener noreferrer"
             class="group p-6 border border-gray-200 hover:border-gray-400 transition-colors">
            <div class="w-10 h-10 bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 mb-2">API 文档</h3>
            <p class="text-sm text-gray-600 mb-4">详细的 API 参考文档，包含请求参数、响应格式和错误码说明</p>
            <span class="text-sm text-gray-900 font-medium inline-flex items-center">
              查看文档
              <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </a>

          <div class="group p-6 border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer">
            <div class="w-10 h-10 bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 mb-2">SDK 下载</h3>
            <p class="text-sm text-gray-600 mb-4">官方支持的多种编程语言 SDK，简化集成流程</p>
            <span class="text-sm text-gray-500">即将推出</span>
          </div>

          <div class="group p-6 border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer">
            <div class="w-10 h-10 bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 mb-2">开发者社区</h3>
            <p class="text-sm text-gray-600 mb-4">加入开发者社区，获取技术支持，分享最佳实践</p>
            <span class="text-sm text-gray-500">即将推出</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 支持模型 -->
    <section class="py-20 bg-gray-50">
      <div class="container-custom">
        <div class="max-w-2xl mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-3">支持的模型</h2>
          <p class="text-gray-600">TierFlow 支持主流大语言模型，持续扩展中</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 bg-white border border-gray-200">
            <div class="font-medium text-gray-900 mb-1">OpenAI GPT</div>
            <div class="text-sm text-gray-500">GPT-4 / GPT-3.5</div>
          </div>
          <div class="p-4 bg-white border border-gray-200">
            <div class="font-medium text-gray-900 mb-1">Claude</div>
            <div class="text-sm text-gray-500">Claude 3 系列</div>
          </div>
          <div class="p-4 bg-white border border-gray-200">
            <div class="font-medium text-gray-900 mb-1">文心一言</div>
            <div class="text-sm text-gray-500">百度大模型</div>
          </div>
          <div class="p-4 bg-white border border-gray-200">
            <div class="font-medium text-gray-900 mb-1">通义千问</div>
            <div class="text-sm text-gray-500">阿里大模型</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 开放平台页面
</script>
