import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getRefreshToken, clearAllTokens } from '@/lib/token'
import { logout as apiLogout } from '@/lib/api/auth'

interface User {
  uid: number
  email: string
  nickname: string | null
  avatar_url: string | null
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  hydrated: boolean
  login: (user: User) => void
  logout: () => void
  logoutAsync: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      hydrated: false,

      // 登录时设置用户信息
      login: (user) => {
        set({
          isAuthenticated: true,
          user,
        })
      },

      // 同步登出（仅清除本地状态）
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        })
      },

      // 异步登出（调用后端接口 + 清除 Token）
      logoutAsync: async () => {
        try {
          await apiLogout()
        } catch (error) {
          console.error('Logout API failed:', error)
        } finally {
          // 清除所有 Token
          clearAllTokens()
          // 清除本地状态
          get().logout()
        }
      },
    }),
    {
      name: 'auth-storage',
      // 只持久化 user，不持久化认证状态（由 Token 决定）
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 检查是否存在 Refresh Token 来决定认证状态
          const hasRefreshToken = !!getRefreshToken()
          state.isAuthenticated = hasRefreshToken
          state.hydrated = true
        }
      },
    }
  )
)
