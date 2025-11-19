import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthUser } from '@/types'
import { showAuthToast } from '@/lib/toast'

interface RegisterData {
  username: string
  email?: string
  password: string
  displayName?: string
}

interface AuthState {
  // 状态
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  error: string | null

  // 动作
  login: (username: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
  setUser: (user: AuthUser, token: string) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // 登录功能
      login: async (username: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          })

          const data = await response.json()

          if (data.success) {
            set({
              user: data.data.user,
              token: data.data.token,
              isLoading: false,
              error: null,
            })
            // 显示登录成功toast
            showAuthToast.loginSuccess(data.data.user.username)
            return true
          } else {
            set({
              isLoading: false,
              error: data.message || '登录失败'
            })
            // 显示登录失败toast
            showAuthToast.loginError(data.message || '登录失败')
            return false
          }
        } catch (error) {
          console.error('Login error:', error)
          set({
            isLoading: false,
            error: '网络连接错误，请重试'
          })
          // 显示网络错误toast
          showAuthToast.networkError()
          return false
        }
      },

      // 注册功能
      register: async (data: RegisterData): Promise<boolean> => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          const result = await response.json()

          if (result.success) {
            set({
              user: result.data.user,
              token: result.data.token,
              isLoading: false,
              error: null,
            })
            return true
          } else {
            set({
              isLoading: false,
              error: result.message || '注册失败'
            })
            return false
          }
        } catch (error) {
          console.error('Register error:', error)
          set({
            isLoading: false,
            error: '网络连接错误，请重试'
          })
          return false
        }
      },

      // 登出功能
      logout: () => {
        const currentUser = get().user
        set({
          user: null,
          token: null,
          isLoading: false,
          error: null,
        })
        // 显示登出成功toast
        if (currentUser) {
          showAuthToast.logoutSuccess()
        }
      },

      // 检查认证状态
      checkAuth: async (): Promise<void> => {
        const { token } = get()

        if (!token) {
          set({ isLoading: false })
          return
        }

        set({ isLoading: true })

        try {
          const response = await fetch('/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              set({
                user: data.data,
                isLoading: false,
              })
            } else {
              // API 返回失败，清除认证状态
              get().logout()
            }
          } else {
            // HTTP 请求失败，清除认证状态
            get().logout()
          }
        } catch (error) {
          console.error('Auth check error:', error)
          get().logout()
        }
      },

      // 手动设置用户信息
      setUser: (user: AuthUser, token: string) => {
        set({
          user,
          token,
          isLoading: false,
          error: null,
        })
      },

      // 清除错误信息
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // 只持久化 user 和 token，不持久化 isLoading
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        // 重新水合时检查认证状态
        state?.checkAuth?.()
      },
    }
  )
)

// 导出便捷的选择器
export const useAuth = () => useAuthStore()

export const useAuthUser = () => useAuthStore((state) => state.user)
export const useAuthToken = () => useAuthStore((state) => state.token)
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user)
export const useIsLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)
export const useIsAdmin = () => useAuthStore((state) => state.user?.isAdmin || false)