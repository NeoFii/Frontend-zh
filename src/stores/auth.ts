import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      hydrated: false,

      // 登录时设置用户信息（token 由 HttpOnly Cookie 处理）
      login: (user) => {
        set({
          isAuthenticated: true,
          user,
        })
      },

      // 登出清除所有状态
      logout: () => set({
        isAuthenticated: false,
        user: null,
      }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Cookie 认证状态由后端管理，前端仅存储用户信息用于显示
          state.hydrated = true
        }
      },
    }
  )
)
