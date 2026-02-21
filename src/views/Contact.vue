<template>
  <div class="animate-fade-in">
    <!-- Page Header - 科技感设计 -->
    <div class="relative bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white py-24 overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      <div class="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>

      <div class="relative container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <span class="inline-block px-4 py-1 bg-white/10 rounded-full text-sm mb-4">联系我们</span>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">开启 AI 合作之旅</h1>
          <p class="text-xl text-gray-300">无论您有任何问题或合作意向，我们的专家团队随时准备为您服务</p>
        </div>
      </div>
    </div>

    <section class="py-20">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Info -->
          <div>
            <h2 class="text-2xl font-bold mb-6">联系方式</h2>
            <p class="text-gray-600 mb-8">
              无论您有任何问题、建议或合作意向，我们都非常期待收到您的来信。您可以通过以下方式联系我们：
            </p>

            <div class="space-y-6">
              <div class="flex items-start">
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold">公司地址</h3>
                  <p class="text-gray-600">北京市海淀区中关村科技园 Eucal AI 大厦</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold">联系电话</h3>
                  <p class="text-gray-600">400-888-8888</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold">电子邮箱</h3>
                  <p class="text-gray-600">contact@eucal.ai</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold">营业时间</h3>
                  <p class="text-gray-600">周一至周五 9:00-18:00</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <h2 class="text-2xl font-bold mb-6">在线留言</h2>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    minlength="2"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">邮箱 *</label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="请输入您的邮箱"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">电话</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="请输入您的电话"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
                  <input
                    v-model="form.company"
                    type="text"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="请输入您的公司名称"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">主题 *</label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="请输入留言主题"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">留言内容 *</label>
                <textarea
                  v-model="form.message"
                  required
                  rows="5"
                  minlength="10"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="请输入您的留言内容（至少10个字符）"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="submitting"
                class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="submitting">提交中...</span>
                <span v-else>提交留言</span>
              </button>
            </form>

            <!-- Success Message -->
            <div v-if="showSuccess" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-green-700">您的留言已提交成功，我们会尽快与您联系！</span>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-red-700">{{ errorMessage }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { submitContactForm } from '@/api/contact'
import type { ContactForm } from '@/types'

const form = reactive<ContactForm>({
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
})

const submitting = ref(false)
const showSuccess = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  submitting.value = true
  showSuccess.value = false
  errorMessage.value = ''

  try {
    const res = await submitContactForm(form)
    if (res.code === 'success') {
      showSuccess.value = true
      // 重置表单
      Object.assign(form, {
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      })
    } else {
      errorMessage.value = res.message || '提交失败，请稍后重试'
    }
  } catch (error) {
    errorMessage.value = '网络错误，请检查网络连接后重试'
  } finally {
    submitting.value = false
  }
}
</script>
