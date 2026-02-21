<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="bg-gray-900 text-white py-20">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">产品服务</h1>
        <p class="text-xl text-gray-300">全方位技术解决方案，助力企业数字化转型</p>
      </div>
    </div>

    <!-- Products Grid -->
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
            {{ cat === 'all' ? '全部产品' : cat }}
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
            class="card group cursor-pointer"
            @click="$router.push(`/products/${product.id}`)"
          >
            <div class="aspect-video bg-gray-100 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <component :is="product.icon || 'CogIcon'" class="w-20 h-20 text-primary-300" />
              </div>
            </div>
            <div class="p-6">
              <span class="text-sm text-primary-600 font-medium">{{ product.category }}</span>
              <h3 class="text-xl font-semibold mt-2 mb-3 group-hover:text-primary-600 transition-colors">
                {{ product.name }}
              </h3>
              <p class="text-gray-600 mb-4">{{ product.short_description }}</p>
              <div class="flex items-center text-primary-600 font-medium">
                了解详情
                <svg class="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!productsStore.loading && filteredProducts.length === 0" class="text-center py-20">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-gray-600">暂无该分类的产品</p>
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
const categories = ['all', '云服务', '数据智能', '开发工具', '网络安全']

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
