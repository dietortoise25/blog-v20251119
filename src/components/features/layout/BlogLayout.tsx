"use client"

import * as React from 'react'
import { Navbar } from './Navbar'
import { Breadcrumb } from './Breadcrumb'
import { cn } from '@/lib/utils'

interface BlogLayoutProps {
  children: React.ReactNode
  className?: string
  showBreadcrumb?: boolean
}

export function BlogLayout({
  children,
  className,
  showBreadcrumb = true
}: BlogLayoutProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 border-b border-border bg-card/95">
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <div className="w-24 h-4 bg-muted rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-48"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className={cn("container mx-auto px-4 py-8", className)}>
        {showBreadcrumb && <Breadcrumb />}
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="terminal-window">
            <div className="text-center space-y-4">
              <div className="terminal-cyan">
                $ system_status --all
              </div>
              <div className="terminal-muted text-sm space-y-2">
                <div>• Blog powered by Next.js 16 + TypeScript</div>
                <div>• Database: PostgreSQL with Prisma ORM</div>
                <div>• Theme: Cyberpunk Terminal Style</div>
                <div>• Font: JetBrains Mono (统一字体系统)</div>
              </div>
              <div className="terminal-green text-xs">
                © 2025 cyber-blog@terminal | Built with ❤️ and code
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}