import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // State
  const loading = ref(false)
  const sidebarOpen = ref(false)

  // Getters
  const isLoading = computed(() => loading.value)
  const isSidebarOpen = computed(() => sidebarOpen.value)

  // Actions
  function setLoading(value: boolean) {
    loading.value = value
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  return {
    loading,
    sidebarOpen,
    isLoading,
    isSidebarOpen,
    setLoading,
    toggleSidebar,
    closeSidebar,
  }
})
