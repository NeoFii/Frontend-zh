<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-transform duration-300"
    :class="{ '-translate-y-full': isHidden }"
  >
    <div class="container-custom">
      <nav class="flex items-center h-20">
        <!-- Logo + Navigation 左侧组 -->
        <div class="flex items-center">
          <!-- Logo -->
          <RouterLink to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <span class="text-white font-bold text-xl">E</span>
            </div>
            <span class="text-xl font-bold text-gray-900 tracking-tight font-sans">{{ companyName }}</span>
          </RouterLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-1 ml-10">
            <template v-for="item in navItems" :key="item.path">
              <!-- 有子菜单的项 -->
              <div
                v-if="item.children && item.children.length > 0"
                class="relative group"
              >
                <button
                  class="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 text-[15.5px] font-medium tracking-wide transition-colors duration-200 rounded-lg hover:bg-gray-50/50"
                  :class="{ 'text-gray-900': item.children?.some(child => $route.path === child.path) }"
                >
                  {{ item.name }}
                  <svg
                    class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <!-- 下拉菜单 -->
                <div
                  class="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-2 group-hover:translate-y-0"
                >
                  <div class="bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[100px]">
                    <RouterLink
                      v-for="child in item.children"
                      :key="child.path"
                      :to="child.path"
                      class="block px-3 py-1.5 text-center text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-[14px] font-medium transition-colors duration-150"
                      :class="{ 'text-primary-600 bg-primary-50': $route.path === child.path }"
                    >
                      {{ child.name }}
                    </RouterLink>
                  </div>
                </div>
              </div>
              <!-- 普通导航项 -->
              <RouterLink
                v-else
                :to="item.path"
                class="px-3 py-2 text-gray-700 hover:text-gray-900 text-[15.5px] font-medium tracking-wide transition-colors duration-200 rounded-lg hover:bg-gray-50/50"
                :class="{ 'text-gray-900': $route.path === item.path }"
              >
                {{ item.name }}
              </RouterLink>
            </template>
          </div>
        </div>

        <!-- Spacer 占据剩余空间 -->
        <div class="flex-1"></div>

        <!-- CTA Button 右侧 -->
        <div class="hidden md:flex items-center">
          <RouterLink to="/login" class="px-5 py-2.5 bg-gray-900 text-white text-[15px] font-semibold rounded-full hover:bg-gray-800 transition-colors duration-200">
            登录
          </RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMenu"
          class="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>

      <!-- Mobile Navigation -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div v-if="isMenuOpen" class="md:hidden py-4 border-t border-gray-100">
          <div class="flex flex-col space-y-1">
            <template v-for="item in navItems" :key="item.path">
              <!-- 有子菜单的项 -->
              <div v-if="item.children && item.children.length > 0">
                <div class="px-4 py-3 text-gray-700 text-[15px] font-medium tracking-wide">
                  {{ item.name }}
                </div>
                <div class="ml-4 space-y-1">
                  <RouterLink
                    v-for="child in item.children"
                    :key="child.path"
                    :to="child.path"
                    @click="closeMenu"
                    class="block px-4 py-2.5 text-gray-600 hover:text-gray-900 text-[14px] font-medium hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    :class="{ 'text-primary-600 bg-primary-50': $route.path === child.path }"
                  >
                    {{ child.name }}
                  </RouterLink>
                </div>
              </div>
              <!-- 普通导航项 -->
              <RouterLink
                v-else
                :to="item.path"
                @click="closeMenu"
                class="px-4 py-3 text-gray-700 hover:text-gray-900 text-[15px] font-medium tracking-wide hover:bg-gray-50 rounded-lg transition-colors duration-200"
                :class="{ 'text-gray-900 bg-gray-50': $route.path === item.path }"
              >
                {{ item.name }}
              </RouterLink>
            </template>
            <div class="pt-2 mt-2 border-t border-gray-100">
              <RouterLink
                to="/login"
                @click="closeMenu"
                class="block w-full text-center px-4 py-3 bg-gray-900 text-white rounded-lg text-[15px] font-semibold"
              >
                登录
              </RouterLink>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { NavItem } from '@/types'

const companyName = import.meta.env.VITE_COMPANY_NAME || 'Eucal AI'

const navItems: NavItem[] = [
  {
    name: '产品服务',
    path: '',
    children: [
      { name: 'TierFlow', path: '/products/1' },
    ],
  },
  { name: '开放平台', path: '/platform' },
  { name: '新闻动态', path: '/news' },
  { name: '关于我们', path: '/about' },
]

const isMenuOpen = ref(false)
const isHidden = ref(false)

// 记录上一次滚动位置
let lastScrollY = 0

// 处理滚动事件
const handleScroll = () => {
  const currentScrollY = window.scrollY

  // 在页面顶部时显示导航栏
  if (currentScrollY < 10) {
    isHidden.value = false
  } else if (currentScrollY > lastScrollY) {
    // 向下滚动 - 隐藏导航栏
    isHidden.value = true
  } else {
    // 向上滚动 - 显示导航栏
    isHidden.value = false
  }

  lastScrollY = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>
