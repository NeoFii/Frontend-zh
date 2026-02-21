<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative container-custom py-24 md:py-32">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            创新驱动未来<br />科技引领发展
          </h1>
          <p class="text-xl md:text-2xl text-primary-100 mb-8">
            我们致力于为客户提供领先的技术解决方案，助力企业数字化转型，共创美好未来。
          </p>
          <div class="flex flex-wrap gap-4">
            <RouterLink to="/products" class="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              了解产品
            </RouterLink>
            <RouterLink to="/contact" class="btn-secondary border-white text-white bg-transparent hover:bg-white/10">
              联系我们
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-50">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="section-title">我们的优势</h2>
          <p class="section-subtitle">专业技术团队，全方位服务保障</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="card p-8 text-center">
            <div class="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
              <component :is="feature.icon" class="w-8 h-8 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Preview -->
    <section class="py-20">
      <div class="container-custom">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="section-title mb-4">产品服务</h2>
            <p class="text-gray-600">为您提供全方位的技术解决方案</p>
          </div>
          <RouterLink to="/products" class="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-medium">
            查看全部
            <svg class="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.id" class="card group cursor-pointer">
            <div class="aspect-video bg-gray-200 relative overflow-hidden">
              <div class="absolute inset-0 bg-primary-600/10 group-hover:bg-primary-600/0 transition-colors"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <component :is="product.icon" class="w-16 h-16 text-primary-600/50" />
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                {{ product.name }}
              </h3>
              <p class="text-gray-600 text-sm">{{ product.short_description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- News Preview -->
    <section class="py-20 bg-gray-50">
      <div class="container-custom">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="section-title mb-4">新闻动态</h2>
            <p class="text-gray-600">了解公司最新动态与行业资讯</p>
          </div>
          <RouterLink to="/news" class="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-medium">
            查看全部
            <svg class="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article v-for="news in latestNews" :key="news.id" class="card overflow-hidden group cursor-pointer">
            <div class="aspect-video bg-gray-200 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <span class="text-sm">{{ formatDate(news.created_at) }}</span>
              </div>
            </div>
            <div class="p-6">
              <span class="text-sm text-primary-600 font-medium">{{ news.category }}</span>
              <h3 class="text-lg font-semibold mt-2 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                {{ news.title }}
              </h3>
              <p class="text-gray-600 text-sm line-clamp-2">{{ news.summary }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary-600">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          准备好开始了吗？
        </h2>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          联系我们，获取专属的技术解决方案，助力您的业务腾飞
        </p>
        <RouterLink to="/contact" class="btn-primary bg-white text-primary-600 hover:bg-gray-100">
          立即咨询
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useNewsStore, useProductsStore } from '@/stores'

// 使用 store
const newsStore = useNewsStore()
const productsStore = useProductsStore()

const latestNews = computed(() => newsStore.latestNews)
const products = computed(() => productsStore.activeProducts.slice(0, 4))

// 特色功能
const features = [
  {
    title: '专业团队',
    description: '拥有多年行业经验的技术专家团队，为您提供专业服务',
    icon: 'UsersIcon',
  },
  {
    title: '定制方案',
    description: '根据您的业务需求，量身定制最适合的解决方案',
    icon: 'CogIcon',
  },
  {
    title: '持续支持',
    description: '7x24小时技术支持，确保您的业务持续稳定运行',
    icon: 'SupportIcon',
  },
]

// 简单的日期格式化
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
