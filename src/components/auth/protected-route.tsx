'use client'

import * as React from 'react'
import { useIsLoading, useIsAuthenticated } from '@/stores/auth-store'
import { showAuthToast } from '@/lib/toast'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const isLoading = useIsLoading()
  const isAuthenticated = useIsAuthenticated()

  // 显示权限错误toast（只在首次检测到未认证时显示）
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const timer = setTimeout(() => {
        showAuthToast.permissionError()
      }, 1000)
      return () => {
        clearTimeout(timer)
      }
    }
    return undefined
  }, [isLoading, isAuthenticated])

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
            onClick={() => window.location.href = '/login'}
            className="cyber-button px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-background transition-all duration-200"
          >
            前往登录
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}