"use client"

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/features/ui'
import { cn } from '@/lib/utils'
import {
  useAuthStore,
  useAuthUser,
  useIsAuthenticated,
  useIsLoading,
  useIsAdmin
} from '@/stores/auth-store'
import { Turtle, Home, FileText, Folder, Info, User, LogOut, Settings } from 'lucide-react'

export function Navbar() {
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // 认证相关状态
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useIsLoading()
  const user = useAuthUser()
  const isAdmin = useIsAdmin()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <nav className="border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-24 h-4 bg-muted rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-border bg-card/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Home Link */}
        <Link
          href="/"
          className="navbar-glitch terminal-green font-mono text-sm hover:text-terminal-cyan transition-colors flex items-center gap-2"
        >
          <span className="text-terminal-cyan"><Turtle size={16} /></span>
          <span>cyber-blog</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "navbar-glitch font-mono text-sm transition-colors flex items-center gap-2",
              pathname === "/"
                ? "terminal-green"
                : "terminal-muted hover:text-terminal-cyan"
            )}
          >
            <Home size={14} />
            <span>home</span>
          </Link>

          <Link
            href="/blog"
            className={cn(
              "navbar-glitch font-mono text-sm transition-colors flex items-center gap-2",
              pathname?.startsWith("/blog")
                ? "terminal-green"
                : "terminal-muted hover:text-terminal-cyan"
            )}
          >
            <FileText size={14} />
            <span>blog</span>
          </Link>

          <Link
            href="/categories"
            className={cn(
              "navbar-glitch font-mono text-sm transition-colors flex items-center gap-2",
              pathname?.startsWith("/categories")
                ? "terminal-green"
                : "terminal-muted hover:text-terminal-cyan"
            )}
          >
            <Folder size={14} />
            <span>categories</span>
          </Link>

          <Link
            href="/about"
            className={cn(
              "navbar-glitch font-mono text-sm transition-colors flex items-center gap-2",
              pathname === "/about"
                ? "terminal-green"
                : "terminal-muted hover:text-terminal-cyan"
            )}
          >
            <Info size={14} />
            <span>about</span>
          </Link>
        </div>

        {/* Right Side - User Info & Actions */}
        <div className="flex items-center gap-4">
          {mounted && !isLoading && isAuthenticated ? (
            // 已登录用户信息
            <div className="flex items-center gap-3">
              {/* 用户信息 */}
              <div className="hidden sm:flex items-center gap-2">
                <User size={14} className="terminal-cyan" />
                <span className="terminal-cyan font-mono text-xs">
                  {user?.displayName || 'user'}
                </span>
                {isAdmin && (
                  <span className="terminal-green font-mono text-xs bg-primary/10 px-2 py-1 rounded">
                    admin
                  </span>
                )}
              </div>

              {/* 分隔符 */}
              <div className="h-4 w-px bg-border hidden sm:block"></div>

              {/* 管理员面板按钮 */}
              {isAdmin && (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="navbar-glitch terminal-command font-mono text-xs px-2 py-1 border border-border rounded hover:border-primary hover:text-primary transition-colors items-center gap-1 hidden sm:flex"
                >
                  <Settings size={12} />
                  <span>admin</span>
                </button>
              )}

              {/* 登出按钮 */}
              <button
                onClick={handleLogout}
                className="navbar-glitch terminal-command font-mono text-xs px-2 py-1 border border-border rounded hover:border-terminal-red hover:text-terminal-red transition-colors flex items-center gap-1"
              >
                <LogOut size={12} />
                <span>logout</span>
              </button>
            </div>
          ) : (
            // 未登录状态
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="navbar-glitch terminal-command font-mono text-xs px-3 py-1 border border-border rounded hover:border-primary hover:text-primary transition-colors flex items-center gap-1"
              >
                <User size={12} />
                <span>login</span>
              </Link>
            </div>
          )}

          {/* 主题切换 */}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden border-t border-border">
        <div className="container mx-auto px-4 py-3">
          {/* Navigation Links */}
          <div className="flex gap-4 overflow-x-auto mb-3">
            <Link
              href="/"
              className={cn(
                "navbar-glitch font-mono text-sm whitespace-nowrap transition-colors flex items-center gap-1",
                pathname === "/"
                  ? "terminal-green"
                  : "terminal-muted hover:text-terminal-cyan"
              )}
            >
              <Home size={14} />
              <span>home</span>
            </Link>

            <Link
              href="/blog"
              className={cn(
                "navbar-glitch font-mono text-sm whitespace-nowrap transition-colors flex items-center gap-1",
                pathname?.startsWith("/blog")
                  ? "terminal-green"
                  : "terminal-muted hover:text-terminal-cyan"
              )}
            >
              <FileText size={14} />
              <span>blog</span>
            </Link>

            <Link
              href="/categories"
              className={cn(
                "navbar-glitch font-mono text-sm whitespace-nowrap transition-colors flex items-center gap-1",
                pathname?.startsWith("/categories")
                  ? "terminal-green"
                  : "terminal-muted hover:text-terminal-cyan"
              )}
            >
              <Folder size={14} />
              <span>categories</span>
            </Link>

            <Link
              href="/about"
              className={cn(
                "navbar-glitch font-mono text-sm whitespace-nowrap transition-colors flex items-center gap-1",
                pathname === "/about"
                  ? "terminal-green"
                  : "terminal-muted hover:text-terminal-cyan"
              )}
            >
              <Info size={14} />
              <span>about</span>
            </Link>

            {/* Admin Panel Button (Mobile) */}
            {mounted && !isLoading && isAuthenticated && isAdmin && (
              <button
                onClick={() => router.push('/dashboard')}
                className={cn(
                  "navbar-glitch font-mono text-sm whitespace-nowrap transition-colors flex items-center gap-1",
                  pathname?.startsWith("/dashboard")
                    ? "terminal-green"
                    : "terminal-muted hover:text-terminal-cyan"
                )}
              >
                <Settings size={14} />
                <span>admin</span>
              </button>
            )}
          </div>

          {/* User Actions (Mobile) */}
          {mounted && !isLoading && isAuthenticated && (
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <User size={14} className="terminal-cyan" />
                <span className="terminal-cyan font-mono text-xs">
                  {user?.username || 'user'}
                </span>
                {isAdmin && (
                  <span className="terminal-green font-mono text-xs bg-primary/10 px-2 py-1 rounded">
                    admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="navbar-glitch terminal-command font-mono text-xs px-2 py-1 border border-border rounded hover:border-terminal-red hover:text-terminal-red transition-colors flex items-center gap-1"
              >
                <LogOut size={12} />
                <span>logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}