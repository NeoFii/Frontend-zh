<template>
  <div class="animate-fade-in">
    <!-- Loading State -->
    <div v-if="newsStore.loading" class="min-h-screen flex items-center justify-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
    </div>

    <!-- News Content -->
    <div v-else-if="news">
      <!-- Page Header -->
      <div class="bg-gray-900 text-white py-16">
        <div class="container-custom">
          <div class="flex items-center text-sm text-gray-400 mb-4">
            <RouterLink to="/news" class="hover:text-white transition-colors">新闻动态</RouterLink>
            <svg class="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span>新闻详情</span>
          </div>
          <span class="inline-block px-3 py-1 bg-primary-600 rounded-full text-sm mb-4">{{ news.category }}</span>
          <h1 class="text-3xl md:text-4xl font-bold mb-4 max-w-4xl">{{ news.title }}</h1>
          <div class="flex items-center text-gray-400 space-x-4">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ news.author }}
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(news.created_at) }}
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ news.view_count }} 阅读
            </span>
          </div>
        </div>
      </div>

      <!-- Article Content -->
      <section class="py-16">
        <div class="container-custom">
          <div class="max-w-3xl mx-auto">
            <!-- Cover Image -->
            <div v-if="news.cover_image" class="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-8">
              <img :src="news.cover_image" :alt="news.title" class="w-full h-full object-cover" />
            </div>

            <!-- Summary -->
            <div class="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8 rounded-r-lg">
              <p class="text-gray-700 italic">{{ news.summary }}</p>
            </div>

            <!-- Content -->
            <article class="prose prose-lg max-w-none">
              <div class="text-gray-800 leading-relaxed whitespace-pre-line">
                {{ news.content || '暂无详细内容' }}
              </div>
            </article>

            <!-- Back Button -->
            <div class="mt-12 pt-8 border-t">
              <button @click="$router.back()" class="btn-secondary">
                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回新闻列表
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Not Found -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">新闻不存在</h1>
        <p class="text-gray-600 mb-8">抱歉，您访问的新闻不存在或已删除</p>
        <RouterLink to="/news" class="btn-primary">
          返回新闻列表
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNewsStore } from '@/stores'

const route = useRoute()
const newsStore = useNewsStore()

const newsId = computed(() => Number(route.params.id))
const news = computed(() => newsStore.currentNews)

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  if (newsId.value) {
    newsStore.loadNewsDetail(newsId.value)
  }
})
</script>
