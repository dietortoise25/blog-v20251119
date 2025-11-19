"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminCard, AdminInput, AdminButton } from '@/components/features/admin'
import { cn } from '@/lib/utils'
import { useAuthStore, useIsLoading, useAuthError } from '@/stores/auth-store'

export default function LoginPage() {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const isLoading = useIsLoading()
  const authError = useAuthError()
  const { login, clearError } = useAuthStore()
  const [formData, setFormData] = React.useState({
    username: '',
    password: ''
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // 使用auth store处理登录状态
        const success = await login(formData.username, formData.password)

        if (success) {
          // 根据用户权限重定向
          if (data.data.user.isAdmin) {
            router.push('/dashboard')
          } else {
            router.push('/')
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    clearError() // 清除错误信息
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AdminCard className="w-full max-w-md">
          <div className="terminal-cyan text-center">Loading...</div>
        </AdminCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* 登录页面标题 */}
        <div className="text-center">
          <Link
            href="/"
            className="terminal-green font-mono text-2xl hover:text-primary transition-colors inline-block mb-2"
          >
            $ cyber-blog
          </Link>
          <div className="terminal-cyan font-mono text-sm">
            [ admin access required ]
          </div>
        </div>

        {/* 登录表单窗口 */}
        <AdminCard command="sudo login --admin" className="flex flex-col gap-4 justify-center items-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AdminInput
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="admin"
              disabled={isLoading}
              prefix="$"
              label="username:"
            />

            <AdminInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="••••••••"
              disabled={isLoading}
              prefix="#"
              label="password:"
            />

            {authError && (
              <div className="terminal-red text-sm mt-2">
                {authError}
              </div>
            )}

            <div className="pt-4">
              <AdminButton
                type="submit"
                disabled={isLoading}
                className="w-full"
                loading={isLoading}
              >
                {isLoading ? 'authenticating...' : '$ execute_login'}
              </AdminButton>
            </div>
          </form>

          {/* 系统提示 */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="terminal-muted font-mono text-xs space-y-1">
              <div>• Default credentials: admin / admin</div>
              <div>• Access is restricted to authorized personnel</div>
              <div>• All login attempts are logged</div>
            </div>
          </div>
        </AdminCard>

        {/* 返回首页链接 */}
        <div className="text-center">
          <Link
            href="/"
            className="terminal-muted font-mono text-sm hover:text-terminal-cyan transition-colors inline-flex items-center gap-2"
          >
            <span>$</span>
            <span>return_to_home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}