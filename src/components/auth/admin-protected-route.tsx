'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useIsLoading, useIsAuthenticated, useIsAdmin } from '@/stores/auth-store'
import { showAuthToast } from '@/lib/toast'

interface AdminProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminProtectedRoute({ children, fallback }: AdminProtectedRouteProps) {
  const router = useRouter()
  const isLoading = useIsLoading()
  const isAuthenticated = useIsAuthenticated()
  const isAdmin = useIsAdmin()

  // 显示权限错误toast（只在首次检测到非管理员时显示）
  React.useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin) {
      const timer = setTimeout(() => {
        showAuthToast.adminPermissionError()
      }, 1000)
      return () => {
        clearTimeout(timer)
      }
    }
    return undefined
  }, [isLoading, isAuthenticated, isAdmin])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="terminal-cyan text-lg">加载中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="terminal-window max-w-md w-full p-8">
          <h1 className="terminal-green text-2xl font-bold mb-4">需要登录</h1>
          <p className="terminal-muted mb-6">请登录以访问此页面</p>
          <button
            onClick={() => router.push('/login')}
            className="cyber-button px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-background transition-all duration-200"
          >
            前往登录
          </button>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="terminal-window max-w-md w-full p-8">
          <h1 className="terminal-red text-2xl font-bold mb-4">权限不足</h1>
          <div className="terminal-window mb-6">
            <div className="terminal-command font-mono text-sm mb-2">
              $ access_denied --admin_required
            </div>
            <div className="terminal-muted font-mono text-xs space-y-1">
              <div>• Error: Permission denied</div>
              <div>• Access level: User</div>
              <div>• Required level: Admin</div>
            </div>
          </div>
          <p className="terminal-muted mb-6">
            抱歉，只有管理员才能访问控制面板。
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="cyber-button px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-background transition-all duration-200"
            >
              返回首页
            </button>
            <button
              onClick={() => router.back()}
              className="cyber-button px-6 py-2 border border-muted text-muted hover:border-terminal-cyan hover:text-terminal-cyan transition-all duration-200"
            >
              返回上页
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}