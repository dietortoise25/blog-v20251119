"use client"

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { BlogLayout } from '@/components/features/layout'

// 定义文章类型
interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  coverImage: string | null
  status: string
  featured: boolean
  viewCount: number
  likeCount: number
  commentCount: number
  readingTime: number | null
  publishDate: string | null
  readTime: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  author: {
    id: number
    username: string
    displayName: string | null
    avatarUrl: string | null
  }
  categories: Array<{
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
  }>
  tags: Array<{
    id: number
    name: string
    slug: string
    description: string | null
    postCount: number
    createdAt: string
    updatedAt: string
  }>
}

// 定义分类详情类型
interface CategoryDetail {
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

interface CategoryResponse {
  category: CategoryDetail
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function CategoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [category, setCategory] = React.useState<CategoryDetail | null>(null)
  const [posts, setPosts] = React.useState<Post[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const slug = params?.slug as string

  // 获取分类详情和文章
  const fetchCategoryData = React.useCallback(async (page: number = 1) => {
    if (!slug) return

    try {
      setLoading(true)
      const response = await fetch(`/api/categories/${slug}?posts=true&page=${page}&limit=10`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('分类不存在')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        if (page === 1) {
          setCategory(data.data.category)
          setPosts(data.data.posts)
        } else {
          setPosts(prev => [...prev, ...data.data.posts])
        }
        setPagination(data.data.pagination)
      } else {
        throw new Error(data.message || '获取分类详情失败')
      }
    } catch (err) {
      console.error('Error fetching category data:', err)
      setError(err instanceof Error ? err.message : '获取分类详情失败')
    } finally {
      setLoading(false)
    }
  }, [slug])

  React.useEffect(() => {
    setMounted(true)
    fetchCategoryData()
  }, [fetchCategoryData])

  const handlePostClick = (postSlug: string) => {
    router.push(`/blog/${postSlug}`)
  }

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchCategoryData(pagination.page + 1)
    }
  }

  if (!mounted) {
    return (
      <BlogLayout>
        <div className="space-y-8">
          <div className="terminal-window">
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-muted rounded w-48"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="terminal-window">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BlogLayout>
    )
  }

  if (loading && !category) {
    return (
      <BlogLayout>
        <div className="space-y-8">
          <div className="terminal-window">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </BlogLayout>
    )
  }

  if (error || !category) {
    return (
      <BlogLayout>
        <div className="terminal-window">
          <div className="terminal-cyan mb-4">
            $ cat /categories/{slug}.info
          </div>
          <div className="terminal-red mb-4">
            Error: {error || '分类不存在'}
          </div>
          <div className="flex gap-4">
            <Link
              href="/categories"
              className="terminal-green hover:text-primary transition-colors"
            >
              $ cd .. && ls
            </Link>
            <Link
              href="/blog"
              className="terminal-green hover:text-primary transition-colors"
            >
              $ cd /blog && ls
            </Link>
          </div>
        </div>
      </BlogLayout>
    )
  }

  return (
    <BlogLayout>
      <div className="space-y-8">
        {/* 分类信息头部 */}
        <div className="terminal-window">
          <div className="terminal-cyan text-sm mb-4">
            $ cat /categories/{category.slug}.info
          </div>

          <div className="flex items-center gap-4 mb-4">
            {category.icon && (
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
                style={{
                  backgroundColor: category.color + '20',
                  color: category.color
                }}
              >
                {category.icon}
              </div>
            )}
            <div className="flex-1">
              <h1
                className="terminal-green text-3xl font-bold mb-2"
                style={{ color: category.color }}
              >
                {category.name}
              </h1>
              <div className="terminal-muted text-sm">
                /{category.slug} • 共 {pagination.total} 篇文章
              </div>
            </div>
          </div>

          {category.description && (
            <p className="terminal-muted text-sm mb-4 leading-relaxed">
              {category.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span
              className="px-2 py-1 border rounded text-xs"
              style={{
                borderColor: category.color + '50',
                backgroundColor: category.color + '10',
                color: category.color
              }}
            >
              {category.isActive ? 'active' : 'inactive'}
            </span>

            <span className="terminal-muted">
              创建于 {new Date(category.createdAt).toLocaleDateString('zh-CN')}
            </span>

            <span className="terminal-muted">
              更新于 {new Date(category.updatedAt).toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="terminal-window hover:border-primary transition-all duration-300 cursor-pointer group"
              onClick={() => handlePostClick(post.slug)}
            >
              {/* 文章头部信息 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full group-hover:animate-pulse"></div>
                    <h2 className="terminal-cyan text-xl font-bold hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.featured && (
                      <span className="terminal-yellow text-xs px-2 py-1 border border-yellow-500/30 rounded">
                        featured
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {post.publishDate && (
                      <span className="terminal-muted">
                        {post.publishDate}
                      </span>
                    )}

                    {post.readTime && (
                      <span className="terminal-yellow">
                        {post.readTime}
                      </span>
                    )}

                    <span className="terminal-cyan">
                      {post.viewCount} views
                    </span>
                  </div>
                </div>
              </div>

              {/* 文章摘要 */}
              <p className="terminal-muted text-sm mb-4 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              {/* 标签 */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag.id}
                      className="terminal-command text-xs px-2 py-1 border border-border/50 rounded hover:border-primary hover:text-primary transition-colors"
                    >
                      ${tag.name}
                    </span>
                  ))}
                  {post.tags.length > 5 && (
                    <span className="terminal-muted text-xs px-2 py-1">
                      +{post.tags.length - 5} more
                    </span>
                  )}
                </div>
              )}

              {/* 操作区域 */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="terminal-muted text-xs">
                  Author: {post.author.displayName || post.author.username}
                </div>

                <button className="terminal-green text-sm hover:text-primary transition-colors flex items-center gap-2">
                  $ read_article
                  <span className="terminal-cursor">_</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* 加载更多 */}
        {loading && posts.length > 0 && (
          <div className="text-center">
            <div className="terminal-window inline-block">
              <div className="animate-pulse terminal-green">
                $ loading_more_posts...
              </div>
            </div>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="terminal-window text-center">
            <div className="terminal-cyan mb-4">
              $ find /categories/{category.slug}/posts -name "*.md" -type f
            </div>
            <div className="terminal-muted mb-4">
              该分类下暂时没有文章
            </div>
            <Link
              href="/blog"
              className="terminal-command px-4 py-2 border border-border rounded hover:border-primary transition-colors terminal-green inline-block"
            >
              $ browse_all_posts
            </Link>
          </div>
        )}

        {!loading && posts.length > 0 && pagination.page < pagination.totalPages && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="terminal-command px-6 py-3 border border-border rounded hover:border-primary transition-colors terminal-green"
            >
              更多 (第 {pagination.page + 1} 页，共 {pagination.totalPages} 页)
            </button>
          </div>
        )}

        {/* 导航 */}
        <div className="terminal-window">
          <div className="terminal-cyan text-sm mb-4">
            $ navigation_commands
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/categories"
              className="terminal-command px-4 py-2 border border-border rounded hover:border-primary transition-colors terminal-green"
            >
              $ back_to_categories
            </Link>

            <Link
              href="/blog"
              className="terminal-command px-4 py-2 border border-border rounded hover:border-primary transition-colors terminal-green"
            >
              $ view_all_posts
            </Link>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
              }}
              className="terminal-command px-4 py-2 border border-border rounded hover:border-primary transition-colors terminal-green"
            >
              $ copy_category_link
            </button>
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}