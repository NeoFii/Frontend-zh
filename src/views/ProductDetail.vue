<template>
  <div class="animate-fade-in">
    <!-- 加载状态 -->
    <div v-if="productsStore.loading" class="min-h-screen flex items-center justify-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-2 border-gray-400 border-t-transparent"></div>
    </div>

    <!-- 产品内容 -->
    <div v-else-if="product">
      <!-- ========== Hero 区块 - 简约白色 ========== -->
      <section class="relative bg-white pt-24 pb-16 border-b border-gray-100">
        <div class="container-custom">
          <!-- 面包屑 -->
          <div class="flex items-center text-sm text-gray-500 mb-6">
            <RouterLink to="/products" class="hover:text-gray-900 transition-colors">产品服务</RouterLink>
            <svg class="w-4 h-4 mx-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-gray-900">{{ product.name }}</span>
          </div>

          <!-- 主标题区 -->
          <div class="max-w-3xl">
            <h1 class="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              {{ product.name }}
            </h1>
            <p class="text-xl text-gray-500 mb-6 leading-relaxed">
              {{ product.tagline }}
            </p>
            <p class="text-gray-600 mb-8 leading-relaxed">
              {{ product.short_description }}
            </p>

            <!-- CTA 按钮组 -->
            <div class="flex flex-wrap gap-3">
              <RouterLink to="/contact" class="inline-flex items-center px-6 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                开始使用
              </RouterLink>
              <button @click="scrollToSection('features')" class="inline-flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors">
                了解详情
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== 核心数据 - 简约数字 ========== -->
      <section class="py-12 bg-gray-50 border-b border-gray-100">
        <div class="container-custom">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div v-for="stat in (product.stats || defaultStats)" :key="stat.label" class="text-center">
              <p class="text-3xl font-semibold text-gray-900 mb-1">
                {{ stat.value }}<span v-if="stat.suffix" class="text-lg">{{ stat.suffix }}</span>
              </p>
              <p class="text-sm text-gray-500">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== 核心能力 - 简洁列表 ========== -->
      <section id="features" class="py-20">
        <div class="container-custom">
          <div class="max-w-2xl mb-12">
            <h2 class="text-2xl font-semibold text-gray-900 mb-3">核心能力</h2>
            <p class="text-gray-600">{{ product.full_description }}</p>
          </div>

          <!-- 能力列表 - 简洁网格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="highlight in (product.highlights || defaultHighlights)" :key="highlight.id" class="flex gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-gray-100 flex items-center justify-center">
                <component :is="getIconComponent(highlight.icon)" class="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 class="font-medium text-gray-900 mb-1">{{ highlight.title }}</h3>
                <p class="text-sm text-gray-600 leading-relaxed">{{ highlight.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== 使用场景 - 左右布局 ========== -->
      <section v-if="product.use_cases?.length" class="py-20 bg-gray-50">
        <div class="container-custom">
          <h2 class="text-2xl font-semibold text-gray-900 mb-10">应用场景</h2>

          <div class="space-y-12">
            <div v-for="(useCase, index) in product.use_cases" :key="useCase.id"
                 class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div :class="index % 2 === 1 ? 'lg:order-2' : ''">
                <div class="inline-flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span class="w-6 h-px bg-gray-300"></span>
                  场景 {{ index + 1 }}
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ useCase.title }}</h3>
                <p class="text-gray-600 mb-4 leading-relaxed">{{ useCase.description }}</p>
                <ul class="space-y-2">
                  <li v-for="benefit in useCase.benefits" :key="benefit" class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ benefit }}
                  </li>
                </ul>
              </div>
              <div :class="index % 2 === 1 ? 'lg:order-1' : ''"
                   class="aspect-video bg-gray-200 flex items-center justify-center">
                <component :is="getIconComponent(useCase.image || 'DocumentTextIcon')" class="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== 客户评价 - 简洁引用 ========== -->
      <section v-if="product.testimonials?.length" class="py-20">
        <div class="container-custom">
          <h2 class="text-2xl font-semibold text-gray-900 mb-10">客户评价</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="testimonial in product.testimonials" :key="testimonial.id" class="border-l-2 border-gray-200 pl-6">
              <p class="text-gray-700 mb-4 leading-relaxed">"{{ testimonial.content }}"</p>
              <div class="flex items-center">
                <div class="w-8 h-8 bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                  {{ testimonial.author.charAt(0) }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ testimonial.author }}</p>
                  <p class="text-xs text-gray-500">{{ testimonial.company }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== 价格方案 - 简约表格 ========== -->
      <section v-if="product.pricing" class="py-20 bg-gray-50">
        <div class="container-custom">
          <div class="text-center mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">价格方案</h2>
            <p class="text-gray-600">{{ product.pricing.description }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div v-for="plan in product.pricing.plans" :key="plan.id"
                 class="bg-white border border-gray-200 p-6"
                 :class="plan.is_recommended ? 'border-gray-900' : ''">
              <div v-if="plan.is_recommended" class="text-xs text-gray-500 mb-2">推荐</div>
              <h3 class="font-semibold text-gray-900 mb-1">{{ plan.name }}</h3>
              <p class="text-sm text-gray-500 mb-4">{{ plan.description }}</p>

              <div class="mb-4">
                <span class="text-3xl font-semibold text-gray-900">{{ plan.price }}</span>
                <span v-if="plan.period" class="text-gray-500 text-sm">/{{ plan.period }}</span>
              </div>

              <ul class="space-y-2 mb-6">
                <li v-for="feature in plan.features" :key="feature" class="flex items-start text-sm text-gray-600">
                  <svg class="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ feature }}
                </li>
              </ul>

              <button class="w-full py-2 text-sm font-medium border transition-colors"
                      :class="plan.is_recommended
                        ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
                {{ product.pricing.contact_sales ? '联系销售' : '开始使用' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== FAQ - 手风琴 ========== -->
      <section v-if="product.faqs?.length" class="py-20">
        <div class="container-custom">
          <div class="max-w-2xl mx-auto">
            <h2 class="text-2xl font-semibold text-gray-900 mb-8 text-center">常见问题</h2>

            <div class="space-y-4">
              <div v-for="faq in product.faqs" :key="faq.id" class="border-b border-gray-200 pb-4">
                <button @click="toggleFaq(faq.id)" class="w-full flex items-center justify-between text-left py-2">
                  <span class="font-medium text-gray-900">{{ faq.question }}</span>
                  <svg class="w-4 h-4 text-gray-400 transform transition-transform"
                       :class="expandedFaqs.includes(faq.id) ? 'rotate-180' : ''"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div v-show="expandedFaqs.includes(faq.id)" class="pt-2 pb-2">
                  <p class="text-sm text-gray-600 leading-relaxed">{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- 产品不存在 -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">产品不存在</h1>
        <p class="text-gray-500 mb-6">抱歉，您访问的产品不存在或已下架</p>
        <RouterLink to="/products" class="inline-flex items-center px-5 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
          返回产品列表
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw, h } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores'
import {
  BoltIcon,
  ArrowsRightLeftIcon,
  ServerIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  RocketLaunchIcon
} from '@heroicons/vue/24/outline'

// 自定义压缩图标
const CompressIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      'stroke-width': 1.5,
      stroke: 'currentColor',
      class: 'w-5 h-5'
    }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M20 8V6a2 2 0 00-2-2h-2M20 16v2a2 2 0 01-2 2h-2M9 9h6v6H9V9z' })
    ])
  }
})

const route = useRoute()
const productsStore = useProductsStore()

const expandedFaqs = ref<string[]>([])

const productId = computed(() => Number(route.params.id))
const product = computed(() => productsStore.currentProduct)

// 默认数据
const defaultStats = [
  { label: '成本降低', value: '70', suffix: '%' },
  { label: '平均延迟', value: '<100', suffix: 'ms' },
  { label: '服务可用性', value: '99.9', suffix: '%' },
  { label: '缓存命中率', value: '85', suffix: '%' }
]

const defaultHighlights = [
  { id: '1', title: '智能分层缓存', description: '基于语义相似度的多级缓存系统，缓存命中率高达 85%', icon: 'BoltIcon' },
  { id: '2', title: '动态模型路由', description: '根据请求复杂度智能选择最优模型', icon: 'ArrowsRightLeftIcon' },
  { id: '3', title: '自适应压缩', description: '智能上下文压缩，减少 Token 消耗', icon: 'CompressIcon' },
  { id: '4', title: '高可用架构', description: '多区域部署，确保 99.9% 服务可用性', icon: 'ServerIcon' }
]

const iconMap: Record<string, any> = {
  BoltIcon: markRaw(BoltIcon),
  ArrowsRightLeftIcon: markRaw(ArrowsRightLeftIcon),
  ServerIcon: markRaw(ServerIcon),
  ChatBubbleLeftRightIcon: markRaw(ChatBubbleLeftRightIcon),
  DocumentTextIcon: markRaw(DocumentTextIcon),
  RocketLaunchIcon: markRaw(RocketLaunchIcon),
  CompressIcon: markRaw(CompressIcon)
}

function getIconComponent(iconName?: string) {
  if (!iconName) return BoltIcon
  return iconMap[iconName] || BoltIcon
}

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  element?.scrollIntoView({ behavior: 'smooth' })
}

function toggleFaq(faqId: string) {
  const index = expandedFaqs.value.indexOf(faqId)
  if (index > -1) {
    expandedFaqs.value.splice(index, 1)
  } else {
    expandedFaqs.value.push(faqId)
  }
}

onMounted(() => {
  if (productId.value) {
    productsStore.loadProductDetail(productId.value)
  }
})
</script>
