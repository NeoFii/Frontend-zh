<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="bg-gray-900 text-white py-20">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">新闻动态</h1>
        <p class="text-xl text-gray-300">了解公司最新动态与行业资讯</p>
      </div>
    </div>

    <!-- News List -->
    <section class="py-20">
      <div class="container-custom">
        <!-- Category Filter -->
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            class="px-5 py-2 rounded-full font-medium transition-colors duration-200"
            :class="selectedCategory === cat
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ cat === 'all' ? '全部新闻' : cat }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="newsStore.loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p class="mt-4 text-gray-600">加载中...</p>
        </div>

        <!-- News Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="news in filteredNews"
            :key="news.id"
            class="card group cursor-pointer"
            @click="$router.push(`/news/${news.id}`)"
          >
            <div class="aspect-video bg-gray-100 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div v-if="news.cover_image" class="w-full h-full bg-cover bg-center" :style="`background-image: url(${news.cover_image})`"></div>
              <div v-else class="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                <svg class="w-16 h-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 bg-primary-600 text-white text-sm rounded-full">{{ news.category }}</span>
              </div>
            </div>
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-3">
                <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(news.created_at) }}
                <span class="mx-2">·</span>
                <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ news.view_count }} 阅读
              </div>
              <h3 class="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                {{ news.title }}
              </h3>
              <p class="text-gray-600 text-sm line-clamp-2">{{ news.summary }}</p>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div v-if="newsStore.total > pageSize" class="mt-12 flex justify-center">
          <div class="flex space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-lg border"
              :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'"
            >
              上一页
            </button>
            <span class="px-4 py-2">{{ currentPage }} / {{ Math.ceil(newsStore.total / pageSize) }}</span>
            <button
              @click="currentPage++"
              :disabled="currentPage >= Math.ceil(newsStore.total / pageSize)"
              class="px-4 py-2 rounded-lg border"
              :class="currentPage >= Math.ceil(newsStore.total / pageSize) ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'"
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

const newsStore = useNewsStore()

const selectedCategory = ref('all')
const categories = ['all', '公司新闻', '产品动态', '合作动态']

const currentPage = ref(1)
const pageSize = ref(9)

const filteredNews = computed(() => newsStore.allNews)

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
