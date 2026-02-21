<template>
  <div>
    <!-- Hero Section - AI 科技感设计 -->
    <section class="relative min-h-[90vh] flex items-center overflow-hidden">
      <!-- 动态背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
        <!-- 网格装饰 -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <!-- 光晕效果 -->
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div class="relative container-custom py-20">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- 左侧文字内容 -->
          <div class="text-center lg:text-left">
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
              <span class="text-sm text-white/80">AI 技术驱动未来</span>
            </div>

            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              让智能<br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400">赋能每一份数据</span>
            </h1>

            <p class="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Eucal AI 专注于企业级人工智能解决方案，通过先进的机器学习技术，帮助企业挖掘数据价值，实现智能化转型。
            </p>

            <div class="flex flex-wrap gap-4 justify-center lg:justify-start">
              <RouterLink to="/products" class="group inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all duration-300 hover:shadow-lg hover:shadow-primary-600/25">
                探索解决方案
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </RouterLink>
              <RouterLink to="/contact" class="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                预约演示
              </RouterLink>
            </div>

            <!-- 数据统计 -->
            <div class="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              <div>
                <div class="text-3xl md:text-4xl font-bold text-white">500+</div>
                <div class="text-sm text-gray-400 mt-1">企业客户</div>
              </div>
              <div>
                <div class="text-3xl md:text-4xl font-bold text-white">99.9%</div>
                <div class="text-sm text-gray-400 mt-1">服务可用性</div>
              </div>
              <div>
                <div class="text-3xl md:text-4xl font-bold text-white">50亿+</div>
                <div class="text-sm text-gray-400 mt-1">日处理数据</div>
              </div>
            </div>
          </div>

          <!-- 右侧视觉元素 -->
          <div class="hidden lg:block relative">
            <div class="relative w-full aspect-square max-w-lg mx-auto">
              <!-- 中心球体 -->
              <div class="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-violet-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div class="absolute inset-8 bg-gradient-to-br from-primary-600 to-violet-600 rounded-full opacity-80"></div>

              <!-- 轨道装饰 -->
              <div class="absolute inset-0 border-2 border-white/10 rounded-full animate-spin" style="animation-duration: 20s;"></div>
              <div class="absolute inset-12 border border-white/5 rounded-full animate-spin" style="animation-duration: 15s; animation-direction: reverse;"></div>

              <!-- 浮动数据卡片 -->
              <div class="absolute top-0 right-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 animate-bounce" style="animation-duration: 3s;">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">AI 分析准确率</div>
                    <div class="text-lg font-bold text-white">98.7%</div>
                  </div>
                </div>
              </div>

              <div class="absolute bottom-8 left-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 animate-bounce" style="animation-duration: 4s;">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">实时推理速度</div>
                    <div class="text-lg font-bold text-white">&lt; 50ms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI 能力展示 -->
    <section class="py-24 bg-white">
      <div class="container-custom">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">核心能力</span>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">全方位 AI 技术栈</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            从数据处理到模型部署，Eucal AI 提供端到端的人工智能解决方案
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(capability, index) in capabilities" :key="capability.title"
               class="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300"
               :class="{ 'lg:translate-y-8': index === 1 || index === 3 }">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300"
                 :class="capability.bgColor">
              <component :is="capability.icon" class="w-7 h-7" :class="capability.iconColor" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ capability.title }}</h3>
            <p class="text-gray-600 mb-6">{{ capability.description }}</p>
            <ul class="space-y-2">
              <li v-for="item in capability.features" :key="item" class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 产品服务 -->
    <section class="py-24 bg-gray-50">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span class="inline-block px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">产品服务</span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">智能解决方案</h2>
          </div>
          <RouterLink to="/products" class="mt-4 md:mt-0 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            查看全部产品
            <svg class="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </RouterLink>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="product in products" :key="product.id"
               class="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
            <div class="h-48 bg-gradient-to-br relative overflow-hidden" :class="product.gradient">
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <component :is="product.icon" class="w-20 h-20 text-white/80" />
              </div>
            </div>
            <div class="p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {{ product.name }}
              </h3>
              <p class="text-gray-600 mb-6">{{ product.description }}</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in product.tags" :key="tag" class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 客户案例 -->
    <section class="py-24 bg-slate-900">
      <div class="container-custom">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1 bg-white/10 text-white/80 rounded-full text-sm font-medium mb-4">客户案例</span>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">助力企业智能化转型</h2>
          <p class="text-lg text-gray-400 max-w-2xl mx-auto">
            已与众多行业领先企业合作，共同推动 AI 技术落地应用
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(stat, index) in stats" :key="index" class="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400 mb-2">
              {{ stat.value }}
            </div>
            <div class="text-gray-400">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Logo 展示 -->
        <div class="mt-16 pt-16 border-t border-white/10">
          <p class="text-center text-gray-500 mb-8">受到众多企业信赖</p>
          <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            <div v-for="i in 5" :key="i" class="w-32 h-12 bg-white/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 新闻动态 -->
    <section class="py-24 bg-white">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span class="inline-block px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">新闻动态</span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">最新资讯</h2>
          </div>
          <RouterLink to="/news" class="mt-4 md:mt-0 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            查看全部
            <svg class="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </RouterLink>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <article v-for="news in latestNews" :key="news.id" class="group cursor-pointer">
            <div class="relative h-48 rounded-2xl overflow-hidden mb-6 bg-gray-100">
              <div class="absolute inset-0 bg-gradient-to-br from-primary-600 to-violet-600"></div>
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                  {{ news.category }}
                </span>
              </div>
            </div>
            <div class="text-sm text-gray-500 mb-2">{{ formatDate(news.created_at) }}</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
              {{ news.title }}
            </h3>
            <p class="text-gray-600 line-clamp-2">{{ news.summary }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-gradient-to-br from-primary-600 to-violet-700 relative overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div class="container-custom relative">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">
            开启您的 AI 之旅
          </h2>
          <p class="text-xl text-white/80 mb-10">
            与我们的专家团队交流，获取专属的人工智能解决方案
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <RouterLink to="/contact" class="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              免费咨询
            </RouterLink>
            <a href="tel:400-888-8888" class="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              400-888-8888
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useNewsStore, useProductsStore } from '@/stores'

// Store
const newsStore = useNewsStore()
const productsStore = useProductsStore()

const latestNews = computed(() => newsStore.latestNews)

// AI 核心能力
const capabilities = [
  {
    title: '自然语言处理',
    description: '强大的文本理解与生成能力，支持多语言、多场景应用',
    icon: 'ChatBubbleLeftRightIcon',
    bgColor: 'bg-blue-100 group-hover:bg-blue-200',
    iconColor: 'text-blue-600',
    features: ['智能客服', '文本分析', '内容生成'],
  },
  {
    title: '计算机视觉',
    description: '精准的图像识别与分析，赋能视觉智能应用',
    icon: 'EyeIcon',
    bgColor: 'bg-violet-100 group-hover:bg-violet-200',
    iconColor: 'text-violet-600',
    features: ['图像识别', '视频分析', '质量检测'],
  },
  {
    title: '预测分析',
    description: '基于大数据的精准预测，辅助业务决策',
    icon: 'ChartBarIcon',
    bgColor: 'bg-green-100 group-hover:bg-green-200',
    iconColor: 'text-green-600',
    features: ['销售预测', '风险预警', '需求规划'],
  },
  {
    title: '智能自动化',
    description: 'RPA + AI 的智能流程自动化解决方案',
    icon: 'CogIcon',
    bgColor: 'bg-orange-100 group-hover:bg-orange-200',
    iconColor: 'text-orange-600',
    features: ['流程自动化', '文档处理', '智能审批'],
  },
]

// AI 产品
const products = [
  {
    id: 1,
    name: 'Eucal NLP 平台',
    description: '企业级自然语言处理平台，提供文本分类、情感分析、实体识别等全方位 NLP 能力',
    icon: 'DocumentTextIcon',
    gradient: 'from-blue-500 to-cyan-500',
    tags: ['NLP', '文本分析', '智能客服'],
  },
  {
    id: 2,
    name: '智能视觉引擎',
    description: '高精度计算机视觉引擎，支持图像识别、人脸识别、OCR 等多种视觉任务',
    icon: 'CameraIcon',
    gradient: 'from-violet-500 to-purple-500',
    tags: ['CV', '图像识别', 'OCR'],
  },
  {
    id: 3,
    name: '预测分析平台',
    description: '基于机器学习的预测分析平台，帮助企业实现数据驱动的精准决策',
    icon: 'PresentationChartLineIcon',
    gradient: 'from-green-500 to-emerald-500',
    tags: ['ML', '预测分析', '数据挖掘'],
  },
]

// 统计数据
const stats = [
  { value: '85%', label: '客户业务效率提升' },
  { value: '60%', label: '平均成本降低' },
  { value: '3x', label: '决策速度提升' },
]

// 日期格式化
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

onMounted(async () => {
  await Promise.all([
    newsStore.loadNewsList({ page_size: 3 }),
    productsStore.loadProductList(),
  ])
})
</script>
