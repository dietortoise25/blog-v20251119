import { prisma } from '@/lib/prisma'
import { PostQueryParams } from '@/types'
import { z } from 'zod'

// 文章查询参数验证
const postQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.coerce.boolean().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'title', 'viewCount']).default('publishedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  publishedAfter: z.string().datetime().optional(),
  publishedBefore: z.string().datetime().optional(),
})

export type PostQueryInput = z.infer<typeof postQuerySchema>

export class PostService {
  /**
   * 获取文章列表
   */
  static async getPosts(query: PostQueryInput) {
    const validatedQuery = postQuerySchema.parse(query)
    const { page, limit, status, featured, category, tags, search, sortBy, sortOrder, publishedAfter, publishedBefore } = validatedQuery
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: {
      status?: string
      featured?: boolean
      OR?: Array<{
        title: { contains: string; mode?: 'insensitive' }
      } | {
        content: { contains: string; mode?: 'insensitive' }
      } | {
        excerpt: { contains: string; mode?: 'insensitive' }
      }>
      publishedAt?: {
        gte?: Date
        lte?: Date
      }
    } = {}

    // 只有在明确指定status时才过滤，否则获取所有状态（用于admin dashboard）
    if (status) {
      where.status = status
    }

    if (featured !== undefined) {
      where.featured = featured
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }

    // 日期范围查询
    if (publishedAfter || publishedBefore) {
      where.publishedAt = {}
      if (publishedAfter) {
        where.publishedAt.gte = new Date(publishedAfter)
      }
      if (publishedBefore) {
        where.publishedAt.lte = new Date(publishedBefore)
      }
    }

    // 构建排序
    const orderBy: Record<string, 'asc' | 'desc'> = {}
    orderBy[sortBy] = sortOrder

    try {
      // 获取文章总数
      const total = await prisma.post.count({ where })

      // 获取文章列表
      const posts = await prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true
            }
          },
          categories: {
            include: {
              category: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              comments: true,
              views: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      })

      // 格式化数据
      const formattedPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        status: post.status,
        featured: post.featured,
        viewCount: post.viewCount,
        likeCount: post.likeCount,
        commentCount: post._count.comments,
        readingTime: post.readingTime,
        publishDate: post.publishDate,
        readTime: post.readTime,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author ? {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.displayName,
          avatarUrl: post.author.avatarUrl
        } : null,
        categories: post.categories.map(pc => pc.category),
        tags: post.tags.map(pt => pt.tag)
      }))

      return {
        posts: formattedPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw new Error('获取文章列表失败')
    }
  }

  /**
   * 根据slug获取文章详情
   */
  static async getPostBySlug(slug: string, incrementView = true) {
    try {
      const post = await prisma.post.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              bio: true,
              website: true,
              githubUsername: true,
              twitterUsername: true
            }
          },
          categories: {
            include: {
              category: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              comments: true,
              views: true
            }
          }
        }
      })

      if (!post) {
        return null
      }

      // 如果是已发布文章，增加浏览量
      if (incrementView && post.status === 'published') {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            viewCount: {
              increment: 1
            }
          }
        })
      }

      // 格式化数据
      const formattedPost = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        status: post.status,
        featured: post.featured,
        viewCount: post.viewCount + 1, // 包含当前浏览
        likeCount: post.likeCount,
        commentCount: post._count.comments,
        readingTime: post.readingTime,
        publishDate: post.publishDate,
        readTime: post.readTime,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author ? {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.displayName,
          avatarUrl: post.author.avatarUrl,
          bio: post.author.bio,
          website: post.author.website,
          githubUsername: post.author.githubUsername,
          twitterUsername: post.author.twitterUsername
        } : null,
        categories: post.categories.map(pc => pc.category),
        tags: post.tags.map(pt => pt.tag)
      }

      return formattedPost
    } catch (error) {
      console.error('Error fetching post by slug:', error)
      throw new Error('获取文章详情失败')
    }
  }

  /**
   * 获取文章统计信息
   */
  static async getPostStats() {
    try {
      const [total, published, draft, featured] = await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { status: 'published' } }),
        prisma.post.count({ where: { status: 'draft' } }),
        prisma.post.count({ where: { featured: true } })
      ])

      return {
        total,
        published,
        draft,
        featured,
        archived: total - published - draft
      }
    } catch (error) {
      console.error('Error fetching post stats:', error)
      throw new Error('获取文章统计失败')
    }
  }

  /**
   * 根据分类获取文章
   */
  static async getPostsByCategory(categorySlug: string, query: PostQueryInput) {
    const validatedQuery = postQuerySchema.parse(query)
    const { page, limit, sortBy, sortOrder } = validatedQuery
    const skip = (page - 1) * limit

    try {
      // 首先获取分类
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug }
      })

      if (!category) {
        throw new Error('分类不存在')
      }

      // 获取该分类下的文章
      const where = {
        status: 'published',
        categories: {
          some: {
            categoryId: category.id
          }
        }
      }

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            },
            categories: {
              include: {
                category: true
              }
            },
            tags: {
              include: {
                tag: true
              }
            },
            _count: {
              select: {
                comments: true
              }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit
        }),
        prisma.post.count({ where })
      ])

      return {
        category,
        posts: posts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          publishDate: post.publishDate,
          readTime: post.readTime,
          viewCount: post.viewCount,
          commentCount: post._count.comments,
          author: post.author,
          categories: post.categories.map(pc => pc.category),
          tags: post.tags.map(pt => pt.tag)
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Error fetching posts by category:', error)
      throw new Error('获取分类文章失败')
    }
  }

  /**
   * 创建文章
   */
  static async createPost(data: {
    title: string
    slug: string
    content: string
    excerpt?: string | null
    status: string
    authorId: number
    featured?: boolean
    categoryIds?: number[]
    tagIds?: number[]
  }) {
    try {
      const { title, slug, content, excerpt, status, authorId, featured = false, categoryIds = [], tagIds = [] } = data

      const post = await prisma.post.create({
        data: {
          title,
          slug,
          content,
          excerpt,
          status,
          authorId,
          featured,
          publishedAt: status === 'published' ? new Date() : null,
          categories: {
            create: categoryIds.map(categoryId => ({
              categoryId
            }))
          },
          tags: {
            create: tagIds.map(tagId => ({
              tagId
            }))
          }
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true
            }
          },
          categories: {
            include: {
              category: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          }
        }
      })

      // 格式化返回数据
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        status: post.status,
        featured: post.featured,
        viewCount: post.viewCount,
        likeCount: post.likeCount,
        readingTime: post.readingTime,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        categories: post.categories.map(pc => pc.category),
        tags: post.tags.map(pt => pt.tag)
      }
    } catch (error) {
      console.error('Error creating post:', error)
      throw new Error('创建文章失败')
    }
  }

  /**
   * 根据ID获取文章（用于编辑）
   */
  static async getPostById(id: number) {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true
            }
          },
          categories: {
            include: {
              category: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          }
        }
      })

      return post
    } catch (error) {
      console.error('Error fetching post by ID:', error)
      throw new Error('获取文章失败')
    }
  }

  /**
   * 删除文章
   */
  static async deletePost(id: number) {
    try {
      // 先删除关联的分类和标签
      await prisma.postCategory.deleteMany({
        where: { postId: id }
      })

      await prisma.postTag.deleteMany({
        where: { postId: id }
      })

      // 删除文章
      await prisma.post.delete({
        where: { id }
      })
    } catch (error) {
      console.error('Error deleting post:', error)
      throw new Error('删除文章失败')
    }
  }
}