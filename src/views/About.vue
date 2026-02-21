<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="bg-gray-900 text-white py-20">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">关于我们</h1>
        <p class="text-xl text-gray-300">了解我们的故事、愿景和价值观</p>
      </div>
    </div>

    <!-- Company Intro -->
    <section class="py-20">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="section-title">公司简介</h2>
            <p class="text-gray-600 mb-6 leading-relaxed">
              Eucal AI 成立于2020年，是一家专注于人工智能技术研发与应用的创新型科技公司。我们致力于将前沿的 AI 技术转化为实际的商业价值，为企业提供智能化的解决方案。
            </p>
            <p class="text-gray-600 mb-6 leading-relaxed">
              我们的团队由来自全球顶尖高校和科技公司的 AI 专家组成，在机器学习、自然语言处理、计算机视觉等领域拥有深厚的技术积累。我们相信，人工智能将重塑未来，而 Eucal AI 正站在这场变革的最前沿。
            </p>
            <div class="grid grid-cols-3 gap-6 mt-8">
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600">10+</div>
                <div class="text-gray-600">年行业经验</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600">500+</div>
                <div class="text-gray-600">服务客户</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600">200+</div>
                <div class="text-gray-600">专业团队</div>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
              <div class="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <svg class="w-32 h-32 text-primary-600/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision & Mission -->
    <section class="py-20 bg-gray-50">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-10 rounded-2xl shadow-sm">
            <div class="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4">我们的愿景</h3>
            <p class="text-gray-600 leading-relaxed">
              成为全球领先的 AI 技术提供商，用人工智能赋能千行百业，让智能技术惠及每一个人。
            </p>
          </div>
          <div class="bg-white p-10 rounded-2xl shadow-sm">
            <div class="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4">我们的使命</h3>
            <p class="text-gray-600 leading-relaxed">
              以创新的 AI 技术和专业的服务，帮助客户解决复杂问题，创造智能化的未来。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="py-20">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="section-title">核心价值观</h2>
          <p class="section-subtitle">指导我们行为的准则</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="value in coreValues" :key="value.title" class="text-center">
            <div class="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-2xl flex items-center justify-center">
              <component :is="value.icon" class="w-10 h-10 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold mb-3">{{ value.title }}</h3>
            <p class="text-gray-600">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const coreValues = [
  {
    title: '客户至上',
    description: '始终以客户需求为中心，提供超越期望的服务体验',
    icon: 'HeartIcon',
  },
  {
    title: '创新驱动',
    description: '持续探索新技术，为客户带来领先的解决方案',
    icon: 'LightBulbIcon',
  },
  {
    title: '诚信正直',
    description: '以诚信为本，建立长期信任的合作关系',
    icon: 'ShieldCheckIcon',
  },
  {
    title: '协作共赢',
    description: '与客户、伙伴携手并进，共创美好未来',
    icon: 'UserGroupIcon',
  },
]
</script>
