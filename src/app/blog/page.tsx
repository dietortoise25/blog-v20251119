"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
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

interface PostsResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function BlogPage() {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [posts, setPosts] = React.useState<Post[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // 获取文章列表
  const fetchPosts = React.useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts?page=${page}&limit=10&status=published&sortBy=publishedAt&sortOrder=desc`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        if (page === 1) {
          setPosts(data.data.posts)
        } else {
          setPosts(prev => [...prev, ...data.data.posts])
        }
        setPagination(data.data.pagination)
      } else {
        throw new Error(data.message || '获取文章失败')
      }
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError(err instanceof Error ? err.message : '获取文章失败')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    setMounted(true)
    fetchPosts()
  }, [fetchPosts])

  const handlePostClick = (slug: string) => {
    router.push(`/blog/${slug}`)
  }

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchPosts(pagination.page + 1)
    }
  }

  if (!mounted) {
    return (
      <BlogLayout>
        <div className="space-y-8">
          {/* 页面标题骨架 */}
          <div className="terminal-window">
            <div className="animate-pulse space-y-2">
              <div className="h-6 bg-muted rounded w-64"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
            </div>
          </div>

          {/* 文章列表骨架 */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="terminal-window">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
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
            $ cat /var/log/blog/error.log
          </div>
          <div className="terminal-red mb-4">
            Error: {error}
          </div>
          <button
            onClick={() => fetchPosts()}
            className="terminal-green hover:text-primary transition-colors"
          >
            $ retry_fetch_posts
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

          <div className="terminal-green text-2xl font-bold mb-2">
            Blog Archive
          </div>

          <div className="terminal-muted text-sm">
            共 {pagination.total} 篇文章 {loading && '| 加载中...'}
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
                    {post.categories.length > 0 && (
                      <span className="terminal-green" style={{ color: post.categories[0]?.color }}>
                        #{post.categories[0]?.name}
                      </span>
                    )}

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
                  read_article
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
            <div className="terminal-muted">
              No posts found. Start writing to see your articles here!
            </div>
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
      </div>
    </BlogLayout>
  )
}