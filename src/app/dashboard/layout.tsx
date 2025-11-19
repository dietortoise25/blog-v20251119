"use client"

import * as React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthUser, useAuthStore } from '@/stores/auth-store'
import { AdminProtectedRoute } from '@/components/auth/admin-protected-route'
import { cn } from '@/lib/utils'
import { Turtle } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProtectedRoute>
      <DashboardContent>{children}</DashboardContent>
    </AdminProtectedRoute>
  )
}

function DashboardContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const user = useAuthUser()
  const { logout } = useAuthStore()

  const menuItems = [
    { href: '/dashboard', label: 'dashboard', icon: '$' },
    { href: '/dashboard/posts', label: 'posts', icon: '📝' },
    { href: '/dashboard/posts/new', label: 'new_post', icon: '+' },
    { href: '/dashboard/settings', label: 'settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="border-b border-border bg-card/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo 和导航 */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="terminal-green font-mono text-sm hover:text-primary transition-colors flex items-center gap-2"
            >
              <span>$</span>
              <span><Turtle /></span>
            </Link>

            {/* 桌面端导航 */}
            <nav className="hidden md:flex items-center gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-mono text-sm transition-colors flex items-center gap-1",
                    pathname === item.href
                      ? "terminal-green"
                      : "terminal-muted hover:text-terminal-cyan"
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* 用户操作区 */}
          <div className="flex items-center gap-4">
            <span className="terminal-cyan font-mono text-sm">
              {user?.username || 'admin'}@cyber-blog:~$
            </span>
            <button
              onClick={logout}
              className="terminal-command px-3 py-1 border border-border rounded text-xs hover:border-primary transition-colors terminal-green"
            >
              $ logout
            </button>
          </div>
        </div>

        {/* 移动端导航 */}
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-3 flex gap-4 overflow-x-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-mono text-sm whitespace-nowrap transition-colors flex items-center gap-1",
                  pathname === item.href
                    ? "terminal-green"
                    : "terminal-muted hover:text-terminal-cyan"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="terminal-window">
            <div className="terminal-cyan font-mono text-sm">
              $ system_status --admin
            </div>
            <div className="terminal-muted font-mono text-xs space-y-1 mt-2">
              <div>• Admin Panel v1.0.0</div>
              <div>• Session active</div>
              <div>• All systems operational</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}