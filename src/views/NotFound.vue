<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center px-4">
      <div class="text-9xl font-bold text-gray-900 mb-4">404</div>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">页面不存在</h1>
      <p class="text-xl text-gray-600 mb-8">抱歉，您访问的页面不存在或已被移除</p>
      <div class="flex flex-wrap justify-center gap-4">
        <RouterLink to="/" class="btn-primary">
          返回首页
        </RouterLink>
        <button @click="$router.back()" class="btn-secondary">
          返回上一页
        </button>
      </div>
    </div>
  </div>
</template>
