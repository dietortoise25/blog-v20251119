"use client"

import * as React from 'react'
import Link from 'next/link'
import { useAuthUser } from '@/stores/auth-store'
import { showAuthToast } from '@/lib/toast'
import {
  FileText,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  TrendingUp,
  Server
} from 'lucide-react'

// 定义统计数据类型
interface DashboardStats {
  totalPosts: number
  totalViews: number
  totalCategories: number
  publishedToday: number
  totalPublished: number
  totalDrafts: number
  systemStatus: string
  lastUpdated: string
}

// 定义最近文章类型
interface RecentPost {
  id: string
  title: string
  slug: string
  status: string
  date: string
  views: number
}

export default function DashboardPage() {
  const user = useAuthUser()
  const [mounted, setMounted] = React.useState(false)
  const [stats, setStats] = React.useState<DashboardStats | null>(null)
  const [recentPosts, setRecentPosts] = React.useState<RecentPost[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 获取统计数据
  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/stats')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setStats(data.data.stats)
        setRecentPosts(data.data.recentPosts)
      } else {
        throw new Error(data.message || '获取统计数据失败')
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : '获取统计数据失败')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (mounted) {
      fetchDashboardData()
    }
  }, [mounted, fetchDashboardData])

  // 显示欢迎进入dashboard的toast（只显示一次）
  React.useEffect(() => {
    if (mounted && user) {
      // 延迟一点显示，让页面先加载完成
      const timer = setTimeout(() => {
        showAuthToast.welcomeToDashboard(user.username)
      }, 500)

      return () => {
        clearTimeout(timer)
      }
    }
    return undefined
  }, [mounted, user])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-muted rounded w-32"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  // 生成统计数据显示
  const getStatsData = () => {
    if (!stats) return []

    return [
      {
        title: 'Total Posts',
        value: stats.totalPosts.toString(),
        icon: <FileText className="w-6 h-6" />,
        change: `+${stats.publishedToday}`,
        changeType: stats.publishedToday > 0 ? 'positive' as const : 'neutral' as const
      },
      {
        title: 'Total Views',
        value: stats.totalViews.toLocaleString(),
        icon: <Eye className="w-6 h-6" />,
        change: '+156',
        changeType: 'positive' as const
      },
      {
        title: 'Published Today',
        value: stats.publishedToday.toString(),
        icon: <Calendar className="w-6 h-6" />,
        change: stats.publishedToday > 0 ? stats.publishedToday.toString() : '0',
        changeType: stats.publishedToday > 0 ? 'positive' as const : 'neutral' as const
      },
      {
        title: 'System Status',
        value: stats.systemStatus,
        icon: <Server className="w-6 h-6" />,
        change: 'healthy',
        changeType: 'positive' as const
      }
    ]
  }

  const statsData = getStatsData()

  return (
    <div className="space-y-8">
      {/* 欢迎信息 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome to Admin Panel
        </h1>
        <p className="text-muted-foreground">
          Hello, {user?.username}! System time: {new Date().toLocaleString('zh-CN')}
        </p>
      </div>

      {/* 统计数据 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // 加载骨架屏
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <div className="animate-pulse space-y-2">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-6 h-6 bg-muted rounded"></div>
                  <div className="h-6 bg-muted rounded w-12"></div>
                </div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))
        ) : (
          // 实际统计数据
          statsData.map((stat, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="text-muted-foreground">{stat.icon}</div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">
                  {stat.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.changeType === 'positive' && (
                    <span className="text-green-600">
                      <TrendingUp className="inline w-3 h-3 mr-1" />
                      {stat.change}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 快捷操作 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/posts/new"
            className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors text-center group"
          >
            <div className="text-primary mb-3">
              <FileText className="w-8 h-8" />
            </div>
            <div className="text-sm font-medium text-foreground group-hover:text-primary">
              New Post
            </div>
          </Link>

          <Link
            href="/dashboard/posts"
            className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors text-center group"
          >
            <div className="text-primary mb-3">
              <FileText className="w-8 h-8" />
            </div>
            <div className="text-sm font-medium text-foreground group-hover:text-primary">
              Manage Posts
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors text-center group"
          >
            <div className="text-primary mb-3">
              <Clock className="w-8 h-8" />
            </div>
            <div className="text-sm font-medium text-foreground group-hover:text-primary">
              Settings
            </div>
          </Link>

          <Link
            href="/blog"
            className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors text-center group"
          >
            <div className="text-primary mb-3">
              <Eye className="w-8 h-8" />
            </div>
            <div className="text-sm font-medium text-foreground group-hover:text-primary">
              View Blog
            </div>
          </Link>
        </div>
      </div>

      {/* 最近文章 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recent Posts</h2>
          <Link
            href="/dashboard/posts"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View All
          </Link>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="text-red-500 text-sm mb-4">
              Failed to load data: {error}
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="flex gap-4">
                      <div className="h-3 bg-muted rounded w-20"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 bg-muted rounded w-12"></div>
                    <div className="h-4 bg-muted rounded w-8"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground text-sm">
              No posts yet
            </div>
            <Link
              href="/dashboard/posts/new"
              className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-sm mb-2">
                  {post.title}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-4">
                  <span>{post.date}</span>
                  <span>{post.views} views</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  post.status === 'published'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                }`}>
                  {post.status === 'published' ? 'Published' : 'Draft'}
                </span>
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit
                </Link>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* 系统信息 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            System Information
          </h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Blog Engine:</span>
              <span>Next.js 16</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Database:</span>
              <span>PostgreSQL (Local)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Frontend:</span>
              <span>TypeScript + Tailwind CSS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <span className="text-green-600">All systems operational</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Activity
          </h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>User admin logged in</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">✓</span>
              <span>Created new post</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Published article</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">✓</span>
              <span>System backup completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}