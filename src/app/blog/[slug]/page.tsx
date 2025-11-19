"use client"

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BlogLayout } from '@/components/features/layout'

// 定义文章内容类型
interface PostDetail {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
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
    bio: string | null
    website: string | null
    githubUsername: string | null
    twitterUsername: string | null
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

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [post, setPost] = React.useState<PostDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const slug = params?.slug as string

  // 获取文章详情
  const fetchPost = React.useCallback(async () => {
    if (!slug) return

    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${slug}?view=true`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('文章不存在')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setPost(data.data)
      } else {
        throw new Error(data.message || '获取文章失败')
      }
    } catch (err) {
      console.error('Error fetching post:', err)
      setError(err instanceof Error ? err.message : '获取文章失败')
    } finally {
      setLoading(false)
    }
  }, [slug])

  React.useEffect(() => {
    setMounted(true)
    fetchPost()
  }, [fetchPost])

  // 简单的 Markdown 转换器
  const renderMarkdown = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return `<h1 key=${index} class="terminal-green text-2xl font-bold mb-4 mt-6">${line.slice(2)}</h1>`
        } else if (line.startsWith('## ')) {
          return `<h2 key=${index} class="terminal-cyan text-xl font-bold mb-3 mt-5">${line.slice(3)}</h2>`
        } else if (line.startsWith('### ')) {
          return `<h3 key=${index} class="terminal-yellow text-lg font-semibold mb-2 mt-4">${line.slice(4)}</h3>`
        } else if (line.startsWith('#### ')) {
          return `<h4 key=${index} class="text-base font-semibold mb-2 mt-3 text-primary">${line.slice(5)}</h4>`
        } else if (line.startsWith('- ')) {
          return `<li key=${index} class="terminal-muted ml-6 mb-1">• ${line.slice(2)}</li>`
        } else if (line.match(/^\d+\. /)) {
          return `<li key=${index} class="terminal-muted ml-6 mb-1">${line}</li>`
        } else if (line.startsWith('```')) {
          return '' // 跳过代码块标记
        } else if (line.startsWith('`')) {
          return `<code key=${index} class="terminal-cyan bg-muted px-1 py-0.5 rounded text-sm">${line.slice(1, -1)}</code>`
        } else if (line.trim() === '') {
          return `<br key=${index} />`
        } else if (line.startsWith('> ')) {
          return `<blockquote key=${index} class="border-l-4 border-primary pl-4 italic terminal-muted">${line.slice(2)}</blockquote>`
        } else {
          return `<p key=${index} class="terminal-muted mb-3 leading-relaxed">${line}</p>`
        }
      })
      .filter(Boolean)
      .join('')
  }

  if (!mounted) {
    return (
      <BlogLayout>
        <div className="terminal-window">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-2 w-5/6"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </BlogLayout>
    )
  }

  if (loading) {
    return (
      <BlogLayout>
        <div className="space-y-8">
          <div className="terminal-window">
            <div className="animate-pulse space-y-3">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
          </div>
          <div className="terminal-window">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </BlogLayout>
    )
  }

  if (error || !post) {
    return (
      <BlogLayout>
        <div className="terminal-window">
          <div className="terminal-cyan mb-4">
            $ cat {slug}.md
          </div>
          <div className="terminal-red mb-4">
            Error: {error || '文章不存在'}
          </div>
          <button
            onClick={() => router.push('/blog')}
            className="terminal-green hover:text-primary transition-colors"
          >
            $ cd .. && ls
          </button>
        </div>
      </BlogLayout>
    )
  }

  return (
    <BlogLayout>
      <article className="space-y-8">
        {/* 文章头部 */}
        <header className="terminal-window">
          <div className="terminal-cyan text-sm mb-4">
            $ cat {post.slug}.md
          </div>

          <h1 className="terminal-green text-3xl font-bold mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            {post.categories.length > 0 && (
              <span
                className="terminal-green px-2 py-1 border rounded text-xs"
                style={{
                  borderColor: post.categories[0]?.color + '50',
                  backgroundColor: post.categories[0]?.color + '10'
                }}
              >
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

            {post.featured && (
              <span className="terminal-yellow text-xs px-2 py-1 border border-yellow-500/30 rounded">
                featured
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="terminal-green text-xs font-bold">
                  {post.author.displayName?.[0] || post.author.username?.[0] || 'U'}
                </span>
              </div>
              <div>
                <div className="terminal-green text-sm">
                  {post.author.displayName || post.author.username || 'User'}
                </div>
                {post.author.bio && (
                  <div className="terminal-muted text-xs">
                    {post.author.bio}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {post.author.githubUsername && (
                <a
                  href={`https://github.com/${post.author.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-cyan hover:text-primary transition-colors text-xs"
                >
                  github
                </a>
              )}
              {post.author.website && (
                <a
                  href={post.author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-cyan hover:text-primary transition-colors text-xs"
                >
                  website
                </a>
              )}
            </div>
          </div>

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="terminal-command text-xs px-2 py-1 border border-border/50 rounded"
                >
                  ${tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 文章内容 */}
        <div className="terminal-window">
          <div
            className="prose prose-invert max-w-none terminal-content"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(post.content)
            }}
          />
        </div>

        {/* 文章导航 */}
        <div className="terminal-window">
          <div className="terminal-cyan text-sm mb-4">
            $ nav_commands
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/blog')}
              className="terminal-command px-4 py-2 border border-border rounded hover:border-primary transition-colors terminal-green"
            >
              $ back_to_blog
            </button>

            <button className="terminal-command px-4 py-2 border border-border rounded hover:border-primary transition-colors terminal-green">
              $ share_article
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt || '',
                    url: window.location.href
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
              className="terminal-command px-4 py-2 border border-border rounded hover:border-primary transition-colors terminal-green"
            >
              $ copy_link
            </button>
          </div>
        </div>

        {/* 文章统计 */}
        <div className="terminal-window">
          <div className="terminal-cyan text-sm mb-4">
            $ article_stats
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="terminal-green text-lg font-bold">{post.viewCount}</div>
              <div className="terminal-muted text-xs">views</div>
            </div>
            <div>
              <div className="terminal-green text-lg font-bold">{post.likeCount}</div>
              <div className="terminal-muted text-xs">likes</div>
            </div>
            <div>
              <div className="terminal-green text-lg font-bold">{post.commentCount}</div>
              <div className="terminal-muted text-xs">comments</div>
            </div>
            <div>
              <div className="terminal-green text-lg font-bold">{post.readTime || 'N/A'}</div>
              <div className="terminal-muted text-xs">read time</div>
            </div>
          </div>
        </div>
      </article>
    </BlogLayout>
  )
}