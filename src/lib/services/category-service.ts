import { prisma } from '@/lib/prisma'

export class CategoryService {
  /**
   * 获取所有分类
   */
  static async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          sortOrder: 'asc'
        },
        include: {
          _count: {
            select: {
              posts: {
                where: {
                  post: {
                    status: 'published'
                  }
                }
              }
            }
          }
        }
      })

      return categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color,
        icon: category.icon,
        postCount: category._count.posts,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }))
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw new Error('获取分类列表失败')
    }
  }

  /**
   * 根据slug获取分类
   */
  static async getCategoryBySlug(slug: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              posts: {
                where: {
                  post: {
                    status: 'published'
                  }
                }
              }
            }
          }
        }
      })

      if (!category) {
        return null
      }

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color,
        icon: category.icon,
        postCount: category._count.posts,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }
    } catch (error) {
      console.error('Error fetching category by slug:', error)
      throw new Error('获取分类详情失败')
    }
  }

  /**
   * 获取分类统计信息
   */
  static async getCategoryStats() {
    try {
      const [total, active] = await Promise.all([
        prisma.category.count(),
        prisma.category.count({ where: { isActive: true } })
      ])

      return {
        total,
        active,
        inactive: total - active
      }
    } catch (error) {
      console.error('Error fetching category stats:', error)
      throw new Error('获取分类统计失败')
    }
  }
}