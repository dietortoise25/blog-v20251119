"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CyberButton } from '@/components/features/ui'
import { toast } from "sonner"
import {
  FileText,
  Link as LinkIcon,
  Calendar,
  Eye,
  Edit3,
  Hash,
  Type,
  Save,
  X,
  Settings,
  Info
} from 'lucide-react'

// 定义分类类型
interface Category {
  id: number
  name: string
  slug: string
  color: string
}

// 定义标签类型
interface Tag {
  id: number
  name: string
  slug: string
}

export default function NewPostPage() {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [categories, setCategories] = React.useState<Category[]>([])
  const [tags, setTags] = React.useState<Tag[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    categoryId: '',
    tagIds: [] as string[],
    status: 'draft'
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // 自动生成 slug
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // 显示创建中提示
      const toastId = toast.loading('正在创建文章...')

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          status: formData.status,
          categoryIds: formData.categoryId ? [parseInt(formData.categoryId)] : [],
          tagIds: formData.tagIds
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // 更新toast为成功状态
        toast.success('文章创建成功', { id: toastId })
        router.push('/dashboard/posts')
      } else {
        throw new Error(data.message || '创建文章失败')
      }
    } catch (err) {
      console.error('Error creating post:', err)
      toast.error(err instanceof Error ? err.message : '创建文章失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    console.log('预览文章:', formData)
  }

  // 模拟分类数据，实际应该从API获取
  const mockCategories = [
    { id: 1, name: '前端开发', slug: 'frontend' },
    { id: 2, name: '后端开发', slug: 'backend' },
    { id: 3, name: 'JavaScript', slug: 'javascript' },
    { id: 4, name: 'TypeScript', slug: 'typescript' },
    { id: 5, name: 'React', slug: 'react' },
    { id: 6, name: 'Next.js', slug: 'nextjs' },
    { id: 7, name: 'CSS', slug: 'css' },
    { id: 8, name: 'Tailwind CSS', slug: 'tailwindcss' },
    { id: 9, name: '数据库', slug: 'database' },
    { id: 10, name: 'PostgreSQL', slug: 'postgresql' },
    { id: 11, name: '设计系统', slug: 'design-system' },
    { id: 12, name: 'UI/UX', slug: 'ui-ux' }
  ]

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
    <div className="space-y-4 md:space-y-6">
      {/* 页面标题 */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Create New Post
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Create a new blog post
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid lg:grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* 主要内容 */}
          <div className="lg:col-span-1 xl:col-span-2 space-y-4 md:space-y-6">
            {/* 标题 */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-medium text-foreground">
                  Title
                </label>
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter post title..."
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                disabled={isSaving}
              />
            </div>

            {/* Slug */}
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-sm mb-4">
                $ post_slug
              </div>
              <div className="relative">
                <span className="terminal-cyan font-mono text-sm absolute left-3 top-1/2 -translate-y-1/2">
                  /blog/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  placeholder="article-slug"
                  className="w-full pl-12 pr-3 py-3 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* 摘要 */}
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-sm mb-4">
                $ post_excerpt
              </div>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                placeholder="输入文章摘要..."
                className="w-full px-4 py-3 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                disabled={isSaving}
              />
            </div>

            {/* 内容 */}
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-sm mb-4">
                $ post_content --editor=vim
              </div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={20}
                placeholder="输入文章内容... 支持 Markdown 格式"
                className="w-full px-4 py-3 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                disabled={isSaving}
              />
            </div>
          </div>

          {/* 侧边栏设置 */}
          <div className="space-y-6">
            {/* 状态 */}
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-sm mb-4">
                $ post_status
              </div>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                disabled={isSaving}
              >
                <option value="draft">草稿</option>
                <option value="published">发布</option>
              </select>
            </div>

            {/* 分类 */}
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-sm mb-4">
                $ post_category
              </div>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                disabled={isSaving}
              >
                <option value="">选择分类</option>
                {mockCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 标签 */}
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-sm mb-4">
                $ post_tags
              </div>
              <input
                type="text"
                name="tagIds"
                value={formData.tagIds.join(', ')}
                onChange={(e) => {
                  const tagValues = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  setFormData(prev => ({
                    ...prev,
                    tagIds: tagValues
                  }))
                }}
                placeholder="标签1, 标签2, 标签3"
                className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                disabled={isSaving}
              />
              <div className="terminal-muted font-mono text-xs mt-2">
                用逗号分隔多个标签
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-sm mb-4">
                $ actions
              </div>
              <div className="space-y-3">
                <CyberButton
                  type="submit"
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-pulse">saving...</span>
                      <span className="terminal-cursor">_</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>$ save_post</span>
                      <span className="terminal-cursor">_</span>
                    </span>
                  )}
                </CyberButton>

                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={isSaving}
                  className="w-full terminal-command px-4 py-3 border border-border rounded hover:border-primary transition-colors terminal-cyan font-mono text-sm"
                >
                  $ preview_post
                </button>

                <Link href="/dashboard/posts">
                  <button
                    type="button"
                    disabled={isSaving}
                    className="w-full terminal-command px-4 py-3 border border-border rounded hover:border-primary transition-colors terminal-muted font-mono text-sm"
                  >
                    $ cancel
                  </button>
                </Link>
              </div>
            </div>

            {/* 提示信息 */}
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-sm mb-3">
                $ tips
              </div>
              <div className="terminal-muted font-mono text-xs space-y-1">
                <div>• 支持 Markdown 语法</div>
                <div>• 可在设置中配置自动保存</div>
                <div>• 标签有助于文章分类</div>
                <div>• 草稿不会显示在前端</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}