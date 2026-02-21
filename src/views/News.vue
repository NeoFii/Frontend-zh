<template>
  <div class="animate-fade-in">
    <!-- Page Header - 简洁白色设计 -->
    <div class="relative bg-white pt-24 pb-12 overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
      </div>

      <div class="relative container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">最新资讯</h1>
          <p class="text-lg text-gray-600">了解公司最新动态与行业资讯</p>
        </div>
      </div>
    </div>

    <!-- News List -->
    <section class="py-12 bg-gray-50">
      <div class="container-custom">
        <!-- Category Filter -->
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            class="px-5 py-2 rounded-full font-medium text-sm transition-all duration-200"
            :class="selectedCategory === cat
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'"
          >
            {{ cat === 'all' ? '全部新闻' : cat }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="newsStore.loading" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
          <p class="mt-3 text-gray-600 text-sm">加载中...</p>
        </div>

        <!-- News Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="news in filteredNews"
            :key="news.id"
            class="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer group"
            @click="$router.push(`/news/${news.id}`)"
          >
            <div class="aspect-video bg-gray-100 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div v-if="news.cover_image" class="w-full h-full bg-cover bg-center" :style="`background-image: url(${news.cover_image})`"></div>
              <div v-else class="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <svg class="w-12 h-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div class="absolute top-3 left-3">
                <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs rounded-full font-medium">{{ news.category }}</span>
              </div>
            </div>
            <div class="p-5">
              <div class="flex items-center text-xs text-gray-500 mb-2">
                <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(news.created_at) }}
                <span class="mx-1">·</span>
                <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ news.view_count }}
              </div>
              <h3 class="text-base font-semibold text-gray-900 mb-1 group-hover:text-gray-600 transition-colors line-clamp-2">
                {{ news.title }}
              </h3>
              <p class="text-gray-600 text-sm line-clamp-2">{{ news.summary }}</p>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div v-if="newsStore.total > pageSize" class="mt-8 flex justify-center">
          <div class="flex space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-colors"
              :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'"
            >
              上一页
            </button>
            <span class="px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm">{{ currentPage }} / {{ Math.ceil(newsStore.total / pageSize) }}</span>
            <button
              @click="currentPage++"
              :disabled="currentPage >= Math.ceil(newsStore.total / pageSize)"
              class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium transition-colors"
              :class="currentPage >= Math.ceil(newsStore.total / pageSize) ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useNewsStore } from '@/stores'
import type { NewsItem } from '@/types'

const newsStore = useNewsStore()

const selectedCategory = ref('all')
const categories = ['all', '公司新闻', '产品动态', '合作动态']

const currentPage = ref(1)
const pageSize = ref(9)

const defaultNews: NewsItem[] = [
  {
    id: 1,
    title: 'TierFlow 智能分层推理引擎正式发布',
    summary: 'Eucal AI 推出首款产品 TierFlow，通过智能分层缓存与动态路由技术，将 AI 推理成本降低 70%，响应速度提升至毫秒级别。',
    category: '产品动态',
    created_at: '2026-02-20',
    view_count: 1280,
    author: 'Eucal AI 团队',
  },
  {
    id: 2,
    title: 'Eucal AI 完成天使轮融资',
    summary: '公司成功完成数千万人民币天使轮融资，资金将用于 TierFlow 产品的持续研发和市场拓展。',
    category: '公司新闻',
    created_at: '2026-02-15',
    view_count: 856,
    author: 'Eucal AI 团队',
  },
  {
    id: 3,
    title: 'TierFlow 与多家云服务商达成合作',
    summary: 'TierFlow 已正式接入主流云服务平台，为企业用户提供更便捷的部署和使用体验。',
    category: '合作动态',
    created_at: '2026-02-10',
    view_count: 642,
    author: 'Eucal AI 团队',
  },
]

const filteredNews = computed(() => {
  const news = newsStore.allNews
  return news.length > 0 ? news : defaultNews
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const loadData = () => {
  const params: { page: number; page_size: number; category?: string } = {
    page: currentPage.value,
    page_size: pageSize.value,
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  newsStore.loadNewsList(params)
}

watch([selectedCategory, currentPage], loadData)

onMounted(loadData)
</script>
