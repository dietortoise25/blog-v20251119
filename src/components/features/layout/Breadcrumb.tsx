"use client"

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumb() {
  const pathname = usePathname()

  // 将路径转换为面包屑
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (!pathname) return []

    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'root', href: '/' }
    ]

    let currentPath = ''

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // 转换路由名称为显示名称
      let label = segment
      if (segment === 'blog' && index === pathSegments.length - 1) {
        label = 'blog'
      } else if (segment === 'about') {
        label = 'about'
      } else if (segment === 'admin') {
        label = 'admin'
      } else if (/^[a-f0-9-]+$/i.test(segment)) {
        // 如果是文章ID或slug，显示为post
        label = 'post'
      }

      breadcrumbs.push({
        label,
        href: currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // 如果在首页，不显示面包屑
  if (pathname === '/' || !pathname) {
    return null
  }

  return (
    <div className="terminal-window py-2 px-4 mb-6">
      <div className="flex items-center gap-2 text-sm font-mono overflow-x-auto">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <span className="terminal-muted">/</span>
            )}

            {index === breadcrumbs.length - 1 ? (
              <span className="terminal-green">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="terminal-cyan hover:text-terminal-green transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}