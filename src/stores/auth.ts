import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clearAllTokens } from '@/lib/token'
import { logout as apiLogout, type UserInfo } from '@/lib/api/auth'

interface AuthState {
  isAuthenticated: boolean
  user: UserInfo | null
  hydrated: boolean
  login: (user: UserInfo) => void
  setUser: (user: UserInfo | null) => void
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

      // 设置用户信息（用于 SWR 数据同步）
      setUser: (user) => {
        set({ user })
      },

      // 同步登出（仅清除本地状态）
      logout: () => {
        // 清除持久化数据，防止状态残留
        try {
          localStorage.removeItem('auth-storage')
        } catch {
          // SSR 环境忽略
        }
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
          console.error('[Logout] API 调用失败:', error)
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
      // 持久化 user 和 isAuthenticated，确保页面刷新后登录状态不丢失
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => async (state) => {
        if (!state) return
        // 不在这里请求 /auth/me，避免重复调用
        // isAuthenticated 由登录/登出动作维护
        // 用户数据由 useUser 的 SWR 管理
        state.hydrated = true
      },
    }
  )
)
