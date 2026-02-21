<template>
  <div class="animate-fade-in">
    <!-- Loading State -->
    <div v-if="productsStore.loading" class="min-h-screen flex items-center justify-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product">
      <!-- Page Header -->
      <div class="bg-gray-900 text-white py-16">
        <div class="container-custom">
          <div class="flex items-center text-sm text-gray-400 mb-4">
            <RouterLink to="/products" class="hover:text-white transition-colors">产品服务</RouterLink>
            <svg class="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span>{{ product.name }}</span>
          </div>
          <span class="inline-block px-3 py-1 bg-primary-600 rounded-full text-sm mb-4">{{ product.category }}</span>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ product.name }}</h1>
          <p class="text-xl text-gray-300 max-w-2xl">{{ product.short_description }}</p>
        </div>
      </div>

      <!-- Product Detail -->
      <section class="py-20">
        <div class="container-custom">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Left: Image -->
            <div class="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
              <div class="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                <component :is="product.icon || 'CogIcon'" class="w-32 h-32 text-primary-300" />
              </div>
            </div>

            <!-- Right: Content -->
            <div>
              <h2 class="text-2xl font-bold mb-6">产品详情</h2>
              <p class="text-gray-600 leading-relaxed mb-8">
                {{ product.full_description || product.short_description }}
              </p>

              <!-- Features -->
              <h3 class="text-xl font-semibold mb-4">核心特性</h3>
              <ul class="space-y-3 mb-8">
                <li v-for="feature in product.features" :key="feature" class="flex items-start">
                  <svg class="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-gray-700">{{ feature }}</span>
                </li>
              </ul>

              <!-- CTA -->
              <div class="flex flex-wrap gap-4">
                <RouterLink to="/contact" class="btn-primary">
                  咨询产品
                </RouterLink>
                <button @click="$router.back()" class="btn-secondary">
                  返回列表
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Not Found -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">产品不存在</h1>
        <p class="text-gray-600 mb-8">抱歉，您访问的产品不存在或已下架</p>
        <RouterLink to="/products" class="btn-primary">
          返回产品列表
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores'

const route = useRoute()
const productsStore = useProductsStore()

const productId = computed(() => Number(route.params.id))
const product = computed(() => productsStore.currentProduct)

onMounted(() => {
  if (productId.value) {
    productsStore.loadProductDetail(productId.value)
  }
})
</script>
