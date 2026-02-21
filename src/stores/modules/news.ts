import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchNewsList, fetchNewsDetail } from '@/api/news'
import type { NewsItem, NewsListParams } from '@/types'

export const useNewsStore = defineStore('news', () => {
  // State
  const newsList = ref<NewsItem[]>([])
  const currentNews = ref<NewsItem | null>(null)
  const total = ref(0)
  const loading = ref(false)

  // Getters
  const allNews = computed(() => newsList.value)
  const latestNews = computed(() => newsList.value.slice(0, 3))

  // Actions
  async function loadNewsList(params?: NewsListParams) {
    loading.value = true
    try {
      const res = await fetchNewsList(params)
      newsList.value = res.data
      total.value = res.total
      return res
    } finally {
      loading.value = false
    }
  }

  async function loadNewsDetail(id: number) {
    loading.value = true
    try {
      const res = await fetchNewsDetail(id)
      currentNews.value = res.data
      return res
    } finally {
      loading.value = false
    }
  }

  function clearCurrentNews() {
    currentNews.value = null
  }

  return {
    newsList,
    currentNews,
    total,
    loading,
    allNews,
    latestNews,
    loadNewsList,
    loadNewsDetail,
    clearCurrentNews,
  }
})
