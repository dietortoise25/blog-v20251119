"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CyberButton } from '@/components/features/ui'
import { toast } from "sonner"

// 定义分类类型
interface Category {
  id: number
  name: string
  slug: string
}

// 定义文章数据类型
interface PostData {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  status: 'draft' | 'published'
  categoryId: string
  tagIds: string[]
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const postId = params.id
  const [mounted, setMounted] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState<PostData>({
    id: postId,
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    categoryId: '',
    tagIds: [],
    status: 'draft'
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 获取文章数据
  const fetchPost = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts/admin/by-id/${postId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        const postData = data.data.post
        setFormData({
          id: postData.id.toString(),
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          excerpt: postData.excerpt || '',
          categoryId: postData.categories.length > 0 ? postData.categories[0].id.toString() : '',
          tagIds: postData.tags.map((tag: any) => tag.name),
          status: postData.status
        })
      } else {
        throw new Error(data.message || '获取文章失败')
      }
    } catch (err) {
      console.error('Error fetching post:', err)
      setError(err instanceof Error ? err.message : '获取文章失败')

      // 如果API失败，使用模拟数据作为后备
      setFormData({
        id: postId,
        title: 'Next.js 16 与 TypeScript 最佳实践',
        slug: 'nextjs-typescript-best-practices',
        content: `# Next.js 16 与 TypeScript 最佳实践

## 介绍

Next.js 16 带来了许多令人兴奋的新特性，特别是在与 TypeScript 结合使用时。

## 主要特性

### 1. 改进的类型安全

- 更好的类型推断
- 严格的类型检查
- 自动类型生成

### 2. 性能优化

- 更快的构建速度
- 优化的运行时性能
- 改进的代码分割

## 最佳实践

### 项目设置

\`\`\`bash
npx create-next-app@latest my-app --typescript
\`\`\`

### 配置文件

确保你的 \`tsconfig.json\` 包含适当的配置：

\`\`\`json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
\`\`\`

## 总结

通过遵循这些最佳实践，你可以充分利用 Next.js 16 和 TypeScript 的强大功能。`,
        excerpt: '深入了解 Next.js 16 与 TypeScript 结合使用的最佳实践，包括类型安全、性能优化等方面。',
        categoryId: '1',
        tagIds: ['Next.js', 'TypeScript', '前端开发'],
        status: 'published'
      })
    } finally {
      setLoading(false)
    }
  }, [postId])

  React.useEffect(() => {
    if (mounted) {
      fetchPost()
    }
  }, [mounted, fetchPost])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // 显示更新中提示
      const toastId = toast.loading('正在更新文章...')

      const response = await fetch(`/api/posts/admin/by-id/${postId}/update`, {
        method: 'PUT',
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
        toast.success('文章更新成功', { id: toastId })
        router.push('/dashboard/posts')
      } else {
        throw new Error(data.message || '更新文章失败')
      }
    } catch (err) {
      console.error('Error updating post:', err)
      toast.error(err instanceof Error ? err.message : '更新文章失败')
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="terminal-window">
          <div className="terminal-cyan font-mono text-lg mb-4">
            $ nano loading_post.md...
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="terminal-window">
          <div className="text-red-500 font-mono text-lg mb-4">
            Error: {error}
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchPost}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              重试
            </button>
            <Link href="/dashboard/posts">
              <button className="px-4 py-2 border border-border rounded hover:border-primary">
                返回列表
              </button>
            </Link>
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
          $ nano post_{formData.id}.md --edit
        </div>
        <div className="terminal-green font-mono text-2xl font-bold mb-2">
          Edit Post
        </div>
        <div className="terminal-muted font-mono text-sm">
          编辑博客文章 - ID: {formData.id}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标题 */}
            <div className="terminal-window">
              <div className="terminal-cyan font-mono text-sm mb-4">
                $ post_title
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="输入文章标题..."
                className="w-full px-4 py-3 bg-background border border-border rounded font-mono text-lg text-foreground focus:border-primary focus:outline-none transition-colors"
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
                      <span>$ update_post</span>
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