import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clearAllTokens } from '@/lib/token'
import { logout as apiLogout, type UserInfo } from '@/lib/api/auth'

export type SessionStatus = 'unknown' | 'authenticated' | 'anonymous'

interface AuthState {
  user: UserInfo | null
  sessionStatus: SessionStatus
  isHydrated: boolean
  login: (user: UserInfo) => void
  setSession: (status: SessionStatus, user?: UserInfo | null) => void
  setUser: (user: UserInfo | null) => void
  logout: () => void
  logoutAsync: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      sessionStatus: 'unknown',
      isHydrated: false,

      // 登录时设置用户信息
      login: (user) => {
        set({
          user,
          sessionStatus: 'authenticated',
        })
      },

      // 设置用户信息（用于 SWR 数据同步）
      setSession: (sessionStatus, user) => {
        set((state) => ({
          sessionStatus,
          user:
            user !== undefined
              ? user
              : sessionStatus === 'authenticated'
                ? state.user
                : null,
        }))
      },

      setUser: (user) => {
        set((state) => ({
          user,
          sessionStatus: user ? 'authenticated' : state.sessionStatus === 'unknown' ? 'unknown' : 'anonymous',
        }))
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
          user: null,
          sessionStatus: 'anonymous',
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
      partialize: (state) => ({
        user: state.user,
        sessionStatus: state.sessionStatus === 'authenticated' ? 'unknown' : state.sessionStatus,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        // 不在这里请求 /auth/me，避免重复调用
        // isAuthenticated 由登录/登出动作维护
        // 用户数据由 useUser 的 SWR 管理
        state.isHydrated = true
      },
    }
  )
)
