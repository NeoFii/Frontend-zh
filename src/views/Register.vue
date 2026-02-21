<template>
  <div class="min-h-screen flex">
    <!-- 左侧 - 品牌展示区域 -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- 艺术渐变背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"></div>

      <!-- 流动光晕 -->
      <div class="absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-0 right-1/4 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[80px]"></div>

      <!-- 艺术几何装饰 -->
      <div class="absolute inset-0 flex items-center justify-center">
        <!-- 外圈圆环 -->
        <div class="absolute w-[500px] h-[500px] border border-white/5 rounded-full"></div>
        <div class="absolute w-[400px] h-[400px] border border-white/[0.03] rounded-full border-dashed animate-[spin_60s_linear_infinite]"></div>

        <!-- 抽象几何形态 - 代表智能与连接 -->
        <svg class="absolute w-[600px] h-[600px] opacity-30" viewBox="0 0 600 600">
          <!-- 六边形网格 -->
          <path d="M300 100 L400 175 L400 300 L300 375 L200 300 L200 175 Z" fill="none" stroke="url(#grad1)" stroke-width="0.5"/>
          <path d="M300 150 L360 195 L360 280 L300 325 L240 280 L240 195 Z" fill="none" stroke="url(#grad1)" stroke-width="0.5"/>

          <!-- 流动曲线 -->
          <path d="M100 300 Q 200 200, 300 300 T 500 300" fill="none" stroke="url(#grad2)" stroke-width="1" opacity="0.5">
            <animate attributeName="d" values="M100 300 Q 200 200, 300 300 T 500 300;M100 300 Q 200 400, 300 300 T 500 300;M100 300 Q 200 200, 300 300 T 500 300" dur="8s" repeatCount="indefinite"/>
          </path>
          <path d="M100 350 Q 200 250, 300 350 T 500 350" fill="none" stroke="url(#grad2)" stroke-width="0.5" opacity="0.3">
            <animate attributeName="d" values="M100 350 Q 200 250, 300 350 T 500 350;M100 350 Q 200 450, 300 350 T 500 350;M100 350 Q 200 250, 300 350 T 500 350" dur="10s" repeatCount="indefinite"/>
          </path>

          <!-- 粒子点 -->
          <circle cx="300" cy="237" r="3" fill="#6366f1">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="240" cy="280" r="2" fill="#8b5cf6">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="4s" repeatCount="indefinite" begin="1s"/>
          </circle>
          <circle cx="360" cy="280" r="2" fill="#3b82f6">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="3.5s" repeatCount="indefinite" begin="0.5s"/>
          </circle>

          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.2"/>
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0"/>
              <stop offset="50%" stop-color="#6366f1" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
            </linearGradient>
          </defs>
        </svg>

        <!-- 浮动装饰元素 -->
        <div class="absolute w-32 h-32 border border-white/10 rounded-2xl rotate-12 top-[15%] right-[20%]"></div>
        <div class="absolute w-20 h-20 border border-white/5 rounded-xl -rotate-6 bottom-[25%] left-[15%]"></div>
        <div class="absolute w-4 h-4 bg-indigo-500/30 rounded-full blur-sm top-[30%] left-[25%] animate-[bounce_6s_ease-in-out_infinite]"></div>
        <div class="absolute w-3 h-3 bg-purple-500/30 rounded-full blur-sm bottom-[35%] right-[22%] animate-[bounce_8s_ease-in-out_infinite]"></div>
      </div>

      <!-- 品牌内容 -->
      <div class="relative z-10 flex flex-col justify-center px-16 w-full">
        <h1 class="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
          When you call AI,<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">you call us.</span>
        </h1>
      </div>
    </div>

    <!-- 右侧 - 注册表单区域 -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 py-12 bg-white mt-20">
      <div class="w-full max-w-md">
        <!-- Logo 区域 -->
        <div class="flex items-center justify-center space-x-3 mb-8 lg:hidden">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-xl">E</span>
          </div>
          <span class="text-xl font-bold text-gray-900">Eucal AI</span>
        </div>

        <!-- 标题 -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center justify-center">
            <span class="mr-2">Eucal AI</span>
            <span class="text-gray-300">|</span>
            <span class="ml-2 text-lg font-normal text-gray-600">注册开放平台账户</span>
          </h2>
        </div>

        <!-- 注册步骤指示器 -->
        <div class="flex items-center justify-center mb-8">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">1</div>
            <div class="w-16 h-0.5 bg-gray-200 mx-2"></div>
            <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">2</div>
          </div>
        </div>

        <!-- 注册表单 -->
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- 邮箱输入框 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="请输入邮箱"
            />
          </div>

          <!-- 验证码输入框 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">验证码</label>
            <div class="flex space-x-3">
              <input
                v-model="form.code"
                type="text"
                required
                maxlength="6"
                class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="请输入验证码"
              />
              <button
                type="button"
                @click="sendCode"
                :disabled="codeSending || codeCountdown > 0"
                class="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
              </button>
            </div>
          </div>

          <!-- 密码输入框 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="请设置密码（至少8位）"
            />
          </div>

          <!-- 确认密码 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="请再次输入密码"
            />
          </div>

          <!-- 用户协议 -->
          <div class="flex items-start">
            <input
              id="agreement"
              v-model="form.agreement"
              type="checkbox"
              required
              class="h-4 w-4 mt-1 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <label for="agreement" class="ml-2 text-sm text-gray-600">
              我已阅读并同意
              <a href="#" class="text-gray-900 underline hover:text-gray-700">用户协议</a>
              和
              <a href="#" class="text-gray-900 underline hover:text-gray-700">隐私政策</a>
            </label>
          </div>

          <!-- 注册按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">注册中...</span>
            <span v-else>立即注册</span>
          </button>
        </form>

        <!-- 登录链接 -->
        <div class="mt-6 text-center text-sm">
          <span class="text-gray-500">已有账号？</span>
          <RouterLink to="/login" class="text-gray-900 font-medium hover:text-gray-700 ml-1">
            立即登录
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const codeSending = ref(false)
const codeCountdown = ref(0)

const form = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
  agreement: false,
})

// 发送验证码
const sendCode = async () => {
  if (!form.email) {
    alert('请先输入邮箱')
    return
  }

  codeSending.value = true
  try {
    // TODO: 调用发送验证码 API
    console.log('发送验证码到:', form.email)

    // 开始倒计时
    codeCountdown.value = 60
    const timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('发送验证码失败:', error)
  } finally {
    codeSending.value = false
  }
}

const handleRegister = async () => {
  if (!form.agreement) {
    alert('请阅读并同意用户协议和隐私政策')
    return
  }

  if (form.password !== form.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  if (form.password.length < 8) {
    alert('密码长度至少为8位')
    return
  }

  loading.value = true
  try {
    // TODO: 调用注册 API
    console.log('注册信息:', form)
    // 模拟注册成功
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('注册成功！请登录')
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
