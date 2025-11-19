'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function AuthInitializer() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    // 在客户端初始化时检查认证状态
    checkAuth()
  }, [checkAuth])

  return null // 这个组件不渲染任何内容
}