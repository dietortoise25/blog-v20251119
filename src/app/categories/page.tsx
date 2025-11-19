"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BlogLayout } from '@/components/features/layout'

// 定义分类类型
interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  color: string
  icon: string | null
  postCount: number
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CategoriesResponse {
  categories: Category[]
  stats?: {
    totalCategories: number
    totalPosts: number
    avgPostsPerCategory: number
  }
}

export default function CategoriesPage() {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [categories, setCategories] = React.useState<Category[]>([])
  const [stats, setStats] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // 获取分类列表
  const fetchCategories = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories?stats=true')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setCategories(data.data.categories || data.data)
        if (data.data.stats) {
          setStats(data.data.stats)
        }
      } else {
        throw new Error(data.message || '获取分类失败')
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err instanceof Error ? err.message : '获取分类失败')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    setMounted(true)
    fetchCategories()
  }, [fetchCategories])

  const handleCategoryClick = (slug: string) => {
    router.push(`/categories/${slug}`)
  }

  if (!mounted) {
    return (
      <BlogLayout>
        <div className="space-y-8">
          {/* 页面标题骨架 */}
          <div className="terminal-window">
            <div className="animate-pulse space-y-2">
              <div className="h-6 bg-muted rounded w-48"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
            </div>
          </div>

          {/* 分类网格骨架 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="terminal-window">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BlogLayout>
    )
  }

  if (error) {
    return (
      <BlogLayout>
        <div className="terminal-window">
          <div className="terminal-cyan mb-4">
            $ ls /categories/
          </div>
          <div className="terminal-red mb-4">
            Error: {error}
          </div>
          <button
            onClick={() => fetchCategories()}
            className="terminal-green hover:text-primary transition-colors"
          >
            $ retry_fetch_categories
          </button>
        </div>
      </BlogLayout>
    )
  }

  return (
    <BlogLayout>
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="terminal-window">
          <div className="terminal-cyan text-lg mb-4">
            $ ls -la /categories/
          </div>

          <div className="terminal-green text-2xl font-bold mb-2">
            Categories
          </div>

          <div className="terminal-muted text-sm">
            共 {categories.length} 个分类
            {stats && ` | 总计 ${stats.totalPosts} 篇文章`}
            {loading && '| 加载中...'}
          </div>
        </div>

        {/* 统计信息 */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="terminal-window">
              <div className="terminal-cyan text-sm mb-2">
                $ cat categories_count.txt
              </div>
              <div className="terminal-green text-xl font-bold">
                {stats.totalCategories}
              </div>
              <div className="terminal-muted text-xs">
                总分类数
              </div>
            </div>

            <div className="terminal-window">
              <div className="terminal-cyan text-sm mb-2">
                $ cat total_posts.txt
              </div>
              <div className="terminal-green text-xl font-bold">
                {stats.totalPosts}
              </div>
              <div className="terminal-muted text-xs">
                总文章数
              </div>
            </div>

            <div className="terminal-window">
              <div className="terminal-cyan text-sm mb-2">
                $ cat avg_posts_per_category.txt
              </div>
              <div className="terminal-green text-xl font-bold">
                {stats.avgPostsPerCategory?.toFixed(1) || '0'}
              </div>
              <div className="terminal-muted text-xs">
                平均每分类文章数
              </div>
            </div>
          </div>
        )}

        {/* 分类网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <article
              key={category.id}
              className="terminal-window hover:border-primary transition-all duration-300 cursor-pointer group"
              onClick={() => handleCategoryClick(category.slug)}
            >
              {/* 分类头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {category.icon && (
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: category.color + '20',
                        color: category.color
                      }}
                    >
                      {category.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3
                      className="terminal-cyan text-lg font-bold hover:text-primary transition-colors"
                      style={{ color: category.color }}
                    >
                      {category.name}
                    </h3>
                    <div className="terminal-muted text-xs">
                      /{category.slug}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className="text-lg font-bold"
                    style={{ color: category.color }}
                  >
                    {category.postCount}
                  </span>
                  <span className="terminal-muted text-xs">
                    篇文章
                  </span>
                </div>
              </div>

              {/* 分类描述 */}
              {category.description && (
                <p className="terminal-muted text-sm mb-4 leading-relaxed line-clamp-2">
                  {category.description}
                </p>
              )}

              {/* 分类元信息 */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="terminal-muted text-xs">
                  创建于 {new Date(category.createdAt).toLocaleDateString('zh-CN')}
                </div>

                <button className="terminal-green text-sm hover:text-primary transition-colors flex items-center gap-2">
                  $ view_posts
                  <span className="terminal-cursor">_</span>
                </button>
              </div>

              {/* 活跃指示器 */}
              <div className="flex items-center gap-2 mt-3">
                <div className={`w-2 h-2 rounded-full ${
                  category.isActive ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="terminal-muted text-xs">
                  {category.isActive ? 'active' : 'inactive'}
                </span>
                {category.postCount > 0 && (
                  <>
                    <span className="terminal-muted text-xs">•</span>
                    <span className="terminal-muted text-xs">
                      最近更新 {new Date(category.updatedAt).toLocaleDateString('zh-CN')}
                    </span>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* 空状态 */}
        {!loading && categories.length === 0 && (
          <div className="terminal-window text-center">
            <div className="terminal-cyan mb-4">
              $ find /categories -name "*" -type d
            </div>
            <div className="terminal-muted">
              No categories found. Create your first category to organize your posts!
            </div>
            <div className="mt-4">
              <Link
                href="/dashboard"
                className="terminal-command px-4 py-2 border border-border rounded hover:border-primary transition-colors terminal-green inline-block"
              >
                $ go_to_dashboard
              </Link>
            </div>
          </div>
        )}

        {/* 快捷操作 */}
        {categories.length > 0 && (
          <div className="terminal-window">
            <div className="terminal-cyan text-sm mb-4">
              $ category_commands
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="terminal-command px-4 py-2 border border-border rounded hover:border-primary transition-colors terminal-green"
              >
                $ view_all_posts
              </Link>

              <Link
                href="/dashboard"
                className="terminal-command px-4 py-2 border border-border rounded hover:border-primary transition-colors terminal-green"
              >
                $ manage_categories
              </Link>

              <button
                onClick={() => {
                  const categorySlugs = categories.map(c => c.slug).join(', ')
                  navigator.clipboard.writeText(categorySlugs)
                }}
                className="terminal-command px-4 py-2 border border-border rounded hover:border-primary transition-colors terminal-green"
              >
                $ copy_category_list
              </button>
            </div>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}