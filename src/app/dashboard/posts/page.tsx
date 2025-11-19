"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CyberButton } from '@/components/features/ui'
import { cn } from '@/lib/utils'
import { toast } from "sonner"

// 定义文章类型
interface Post {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft'
  category: string
  publishDate: string
  lastModified: string
  views: number
  readTime: string
}

export default function PostsManagementPage() {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'published' | 'draft'>('all')
  const [posts, setPosts] = React.useState<Post[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 获取文章列表
  const fetchPosts = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/posts/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: 1,
          limit: 50,
          status: filterStatus === 'all' ? undefined : filterStatus,
          sortBy: 'updatedAt',
          sortOrder: 'desc'
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        const formattedPosts = data.data.posts.map((post: any) => ({
          id: post.id.toString(),
          title: post.title,
          slug: post.slug,
          status: post.status,
          category: post.categories.length > 0 ? post.categories[0].name : '未分类',
          publishDate: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('zh-CN') : '',
          lastModified: new Date(post.updatedAt).toLocaleDateString('zh-CN'),
          views: post.viewCount,
          readTime: `${post.readingTime || 5} 分钟`
        }))
        setPosts(formattedPosts)
      } else {
        throw new Error(data.message || '获取文章列表失败')
      }
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError(err instanceof Error ? err.message : '获取文章列表失败')
      // 如果API失败，使用模拟数据作为后备
      setPosts([
        {
          id: '1',
          title: 'Next.js 16 与 TypeScript 最佳实践',
          slug: 'nextjs-typescript-best-practices',
          status: 'published' as const,
          category: '前端开发',
          publishDate: '2025-01-18',
          lastModified: '2025-01-18',
          views: 234,
          readTime: '8 分钟'
        },
        {
          id: '2',
          title: 'Tailwind CSS v4 完全指南',
          slug: 'tailwind-css-v4-guide',
          status: 'published' as const,
          category: 'CSS',
          publishDate: '2025-01-17',
          lastModified: '2025-01-17',
          views: 189,
          readTime: '12 分钟'
        },
        {
          id: '3',
          title: 'Prisma ORM 高级技巧',
          slug: 'prisma-orm-advanced-techniques',
          status: 'published' as const,
          category: '后端开发',
          publishDate: '2025-01-16',
          lastModified: '2025-01-16',
          views: 156,
          readTime: '15 分钟'
        },
        {
          id: '4',
          title: '赛博朋克设计系统构建',
          slug: 'cyberpunk-design-system',
          status: 'draft' as const,
          category: '设计系统',
          publishDate: '',
          lastModified: '2025-01-15',
          views: 0,
          readTime: '20 分钟'
        }
      ])
    } finally {
      setLoading(false)
    }
  }, [filterStatus])

  React.useEffect(() => {
    if (mounted) {
      fetchPosts()
    }
  }, [mounted, fetchPosts])

  // 删除文章
  const showDeleteConfirmation = (postId: string, postTitle: string) => {
    // 显示带确认按钮的toast
    toast.warning(`确定要删除文章 "${postTitle}" 吗？此操作不可撤销。`, {
      action: {
        label: '确认删除',
        onClick: async () => {
          try {
            setDeleteLoading(postId)

            // 更新toast为加载状态
            const toastId = toast.loading('正在删除文章...')

            const response = await fetch(`/api/posts/admin/by-id/${postId}/delete`, {
              method: 'DELETE',
            })

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
              // 从列表中移除删除的文章
              setPosts(prev => prev.filter(post => post.id !== postId))
              // 更新toast为成功状态
              toast.success('文章删除成功', { id: toastId })
            } else {
              throw new Error(data.message || '删除文章失败')
            }
          } catch (err) {
            console.error('Error deleting post:', err)
            // 显示错误提示
            toast.error(err instanceof Error ? err.message : '删除文章失败')
          } finally {
            setDeleteLoading(null)
          }
        },
      },
      cancel: {
        label: '取消',
        onClick: () => {
          // 用户点击取消，什么都不做
          toast.dismiss()
        },
      },
    })
  }

  // 过滤文章
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || post.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="terminal-window">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-32"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="terminal-window">
        <div className="terminal-cyan font-mono text-lg mb-4">
          $ ls /posts/ --admin
        </div>
        <div className="terminal-green font-mono text-2xl font-bold mb-2">
          Posts Management
        </div>
        <div className="terminal-muted font-mono text-sm flex items-center gap-6">
          <span>总计: {stats.total} 篇</span>
          <span className="terminal-green">已发布: {stats.published} 篇</span>
          <span className="terminal-yellow">草稿: {stats.drafts} 篇</span>
        </div>
      </div>

      {/* 操作区域 */}
      <div className="terminal-window">
        <div className="terminal-cyan font-mono text-sm mb-4">
          $ admin_commands
        </div>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* 搜索和筛选 */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <span className="terminal-cyan font-mono text-sm absolute left-3 top-1/2 -translate-y-1/2">
                $
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="search_posts"
                className="w-full sm:w-64 pl-8 pr-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
            >
              <option value="all">all_status</option>
              <option value="published">published</option>
              <option value="draft">drafts</option>
            </select>
          </div>

          {/* 新建文章按钮 */}
          <Link href="/dashboard/posts/new">
            <CyberButton variant="outline" className="whitespace-nowrap">
              <span className="flex items-center gap-2">
                <span>+</span>
                <span>$ new_post</span>
              </span>
            </CyberButton>
          </Link>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="terminal-window">
        <div className="terminal-cyan font-mono text-sm mb-4">
          $ cat posts.log --filtered="{filterStatus}" --search="{searchTerm}"
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <div className="terminal-muted font-mono text-sm">
              没有找到匹配的文章
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="border border-border/50 rounded p-4 hover:bg-border/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="terminal-green font-mono text-base font-semibold mb-2 truncate">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="terminal-cyan">
                        #{post.category}
                      </span>
                      <span className={`px-2 py-1 rounded border ${post.status === 'published'
                          ? 'bg-green-500/20 text-green-500 border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                        }`}>
                        {post.status}
                      </span>
                      {post.publishDate && (
                        <span className="terminal-muted">
                          {post.publishDate}
                        </span>
                      )}
                      <span className="terminal-yellow">
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      {post.status === 'published' && (
                        <div className="terminal-muted font-mono text-xs">
                          {post.views} views
                        </div>
                      )}
                      <div className="terminal-muted font-mono text-xs">
                        修改: {post.lastModified}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="terminal-cyan font-mono text-xs">
                    slug: {post.slug}
                  </div>

                  <div className="flex items-center gap-2">
                    {post.status === 'published' && (
                      <button
                        onClick={() => router.push(`/blog/${post.slug}`)}
                        className="terminal-green font-mono text-xs hover:text-primary transition-colors"
                      >
                        $ view
                      </button>
                    )}
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="terminal-cyan font-mono text-xs hover:text-primary transition-colors"
                    >
                      $ edit
                    </Link>
                    <button
                      onClick={() => showDeleteConfirmation(post.id, post.title)}
                      disabled={deleteLoading === post.id}
                      className="text-red-400 font-mono text-xs hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteLoading === post.id ? '删除中...' : '$ delete'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 分页 */}
        {filteredPosts.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="terminal-muted font-mono text-sm">
                显示 {filteredPosts.length} 篇文章
              </div>
              <div className="flex gap-2">
                <CyberButton variant="outline" size="sm" disabled>
                  $ prev_page
                </CyberButton>
                <CyberButton variant="outline" size="sm" disabled>
                  $ next_page
                </CyberButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}