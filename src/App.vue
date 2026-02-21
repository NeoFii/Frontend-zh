<template>
  <div id="app" class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1" :class="{ 'pt-20': !isFullPage }">
      <RouterView />
    </main>
    <AppFooter v-if="!isFullPage" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'

const route = useRoute()

// 全屏页面（登录/注册）不显示页脚
const isFullPage = computed(() => {
  const fullPageRoutes = ['/login', '/register']
  return fullPageRoutes.includes(route.path)
})
</script>
