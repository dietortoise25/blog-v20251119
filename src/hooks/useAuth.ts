"use client"

import * as React from 'react'

interface User {
  username: string
  role: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export function useAuth(): AuthState {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [user, setUser] = React.useState<User | null>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // 检查本地存储的登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const username = localStorage.getItem('username')

    if (isLoggedIn && username) {
      setIsAuthenticated(true)
      setUser({
        username,
        role: 'admin'
      })
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // 前端验证逻辑
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true)
      setUser({
        username,
        role: 'admin'
      })
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', username)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
  }

  return {
    isAuthenticated,
    user,
    login,
    logout
  }
}