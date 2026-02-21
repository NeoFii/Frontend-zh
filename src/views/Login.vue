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

    <!-- 右侧 - 登录表单区域 -->
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
            <span class="ml-2 text-lg font-normal text-gray-600">开放平台账户登录</span>
          </h2>
        </div>

        <!-- 登录方式切换 -->
        <div class="flex border-b border-gray-200 mb-6">
          <button
            @click="loginType = 'password'"
            class="flex-1 pb-3 text-sm font-medium transition-colors relative"
            :class="loginType === 'password' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'"
          >
            密码登录
            <div v-if="loginType === 'password'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
          </button>
          <button
            @click="loginType = 'code'"
            class="flex-1 pb-3 text-sm font-medium transition-colors relative"
            :class="loginType === 'code' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'"
          >
            邮箱验证码登录
            <div v-if="loginType === 'code'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
          </button>
        </div>

        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="space-y-5">
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

          <!-- 密码输入框 -->
          <div v-if="loginType === 'password'">
            <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="请输入密码"
            />
          </div>

          <!-- 验证码输入框 -->
          <div v-else>
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

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">登录中...</span>
            <span v-else>立即登录</span>
          </button>
        </form>

        <!-- 其他登录方式 -->
        <div class="mt-6 flex items-center justify-between text-sm">
          <a href="#" class="text-gray-500 hover:text-gray-700">忘记密码？</a>
          <RouterLink to="/register" class="text-gray-900 font-medium hover:text-gray-700">
            还没有账号？立即注册
          </RouterLink>
        </div>

        <!-- 分割线 -->
        <div class="mt-8 relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">其他方式</span>
          </div>
        </div>

        <!-- 社交登录 -->
        <div class="mt-6 flex justify-center space-x-4">
          <button class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </button>
          <button class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
          </button>
          <button class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.007-.27-.022-.407-.032zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
            </svg>
          </button>
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
const loginType = ref<'password' | 'code'>('password')
const codeSending = ref(false)
const codeCountdown = ref(0)

const form = reactive({
  email: '',
  password: '',
  code: '',
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

const handleLogin = async () => {
  if (!form.agreement) {
    alert('请阅读并同意用户协议和隐私政策')
    return
  }

  loading.value = true
  try {
    // TODO: 调用登录 API
    console.log('登录信息:', form)
    // 模拟登录成功
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
