import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchProductList, fetchProductDetail } from '@/api/products'
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
      const res = await fetchProductDetail(id)
      currentProduct.value = res.data
      return res
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
