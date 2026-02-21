<template>
  <div class="animate-fade-in">
    <!-- Page Header - 科技感设计 -->
    <div class="relative bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white py-24 overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>

      <div class="relative container-custom">
        <div class="max-w-3xl">
          <span class="inline-block px-4 py-1 bg-white/10 rounded-full text-sm mb-4">产品服务</span>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">AI 智能解决方案</h1>
          <p class="text-xl text-gray-300">全方位人工智能产品矩阵，赋能企业智能化转型</p>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <section class="py-24 bg-gray-50">
      <div class="container-custom">
        <!-- Category Filter -->
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="selectedCategory = cat.value"
            class="px-6 py-3 rounded-full font-medium transition-all duration-200"
            :class="selectedCategory === cat.value
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="productsStore.loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p class="mt-4 text-gray-600">加载中...</p>
        </div>

        <!-- Products List -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer"
            @click="$router.push(`/products/${product.id}`)"
          >
            <!-- 产品图片/图标区域 -->
            <div class="h-56 relative overflow-hidden bg-gradient-to-br" :class="product.gradient || 'from-gray-100 to-gray-200'">
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <component :is="product.icon || 'CogIcon'" class="w-24 h-24 text-white/90 drop-shadow-lg" />
              </div>
              <!-- 分类标签 -->
              <div class="absolute top-4 left-4">
                <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-sm font-medium">
                  {{ product.category }}
                </span>
              </div>
            </div>

            <!-- 产品内容 -->
            <div class="p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {{ product.name }}
              </h3>
              <p class="text-gray-600 mb-6 line-clamp-2">{{ product.short_description }}</p>

              <!-- 特性标签 -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span v-for="feature in product.features" :key="feature" class="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm">
                  {{ feature }}
                </span>
              </div>

              <!-- 了解更多 -->
              <div class="flex items-center text-primary-600 font-medium group/link">
                了解详情
                <svg class="w-5 h-5 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!productsStore.loading && filteredProducts.length === 0" class="text-center py-20">
          <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p class="text-gray-600 text-lg">暂无该分类的产品</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-white">
      <div class="container-custom">
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <!-- 背景装饰 -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>

          <div class="relative">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">需要定制化解决方案？</h2>
            <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              我们的专家团队将根据您的业务需求，提供定制化 AI 解决方案
            </p>
            <RouterLink to="/contact" class="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors">
              联系我们
              <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores'

const productsStore = useProductsStore()

const selectedCategory = ref('all')
const categories = [
  { value: 'all', label: '全部产品' },
  { value: 'NLP', label: '自然语言处理' },
  { value: 'CV', label: '计算机视觉' },
  { value: 'ML', label: '机器学习' },
  { value: 'RPA', label: '智能自动化' },
]

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return productsStore.allProducts
  }
  return productsStore.allProducts.filter(p => p.category === selectedCategory.value)
})

onMounted(() => {
  productsStore.loadProductList()
})
</script>
