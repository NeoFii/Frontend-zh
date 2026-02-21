import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchProductList, fetchProductDetail } from '@/api/products'
import { mockFetchProductDetail, mockProduct } from '@/api/mock'
import type { ProductItem } from '@/types'

export const useProductsStore = defineStore('products', () => {
  // State
  const productList = ref<ProductItem[]>([])
  const currentProduct = ref<ProductItem | null>(null)
  const loading = ref(false)

  // Getters
  const allProducts = computed(() => productList.value)
  const activeProducts = computed(() => productList.value.filter(p => p.is_active))

  // Actions
  async function loadProductList(category?: string) {
    loading.value = true
    try {
      const res = await fetchProductList(category)
      productList.value = res.data
      return res
    } finally {
      loading.value = false
    }
  }

  async function loadProductDetail(id: number) {
    loading.value = true
    try {
      // 先尝试调用真实 API，失败则使用 mock 数据
      try {
        const res = await fetchProductDetail(id)
        currentProduct.value = res.data
        return res
      } catch {
        // API 失败时使用 mock 数据
        const mockRes = await mockFetchProductDetail(id)
        currentProduct.value = mockRes.data
        return mockRes
      }
    } finally {
      loading.value = false
    }
  }

  function clearCurrentProduct() {
    currentProduct.value = null
  }

  return {
    productList,
    currentProduct,
    loading,
    allProducts,
    activeProducts,
    loadProductList,
    loadProductDetail,
    clearCurrentProduct,
  }
})
