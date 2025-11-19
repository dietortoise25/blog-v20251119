import { NextRequest } from 'next/server'
import { CategoryService } from '@/lib/services/category-service'
import { PostService } from '@/lib/services/post-service'
import { successResponse, errorResponse, getQueryParams } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return errorResponse('分类slug不能为空', 400)
    }

    // 获取查询参数
    const queryParams = getQueryParams(request)
    const includePosts = queryParams.posts === 'true'

    let result

    if (includePosts) {
      // 包含该分类下的文章
      const query = {
        page: queryParams.page ? parseInt(queryParams.page as string) : 1,
        limit: queryParams.limit ? parseInt(queryParams.limit as string) : 10,
        sortBy: (queryParams.sortBy as "createdAt" | "updatedAt" | "title" | "viewCount" | "publishedAt") || 'publishedAt',
        sortOrder: (queryParams.sortOrder as "asc" | "desc") || 'desc'
      }

      const [category, postsData] = await Promise.all([
        CategoryService.getCategoryBySlug(slug),
        PostService.getPostsByCategory(slug, query)
      ])

      if (!category) {
        return errorResponse('分类不存在', 404)
      }

      result = {
        category,
        posts: postsData.posts,
        pagination: postsData.pagination
      }
    } else {
      // 仅获取分类信息
      const category = await CategoryService.getCategoryBySlug(slug)

      if (!category) {
        return errorResponse('分类不存在', 404)
      }

      result = category
    }

    return successResponse(result, '获取分类详情成功')
  } catch (error) {
    console.error('Error in GET /api/categories/[slug]:', error)

    const message = error instanceof Error ? error.message : '未知错误'
    return errorResponse(`获取分类详情失败: ${message}`, 500)
  }
}

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // 这里可以添加更新分类的逻辑
    // 暂时返回405 Method Not Allowed
    return errorResponse('方法不允许', 405)
  } catch (error) {
    console.error('Error in PUT /api/categories/[slug]:', error)

    const message = error instanceof Error ? error.message : '未知错误'
    return errorResponse(`更新分类失败: ${message}`, 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // 这里可以添加删除分类的逻辑
    // 暂时返回405 Method Not Allowed
    return errorResponse('方法不允许', 405)
  } catch (error) {
    console.error('Error in DELETE /api/categories/[slug]:', error)

    const message = error instanceof Error ? error.message : '未知错误'
    return errorResponse(`删除分类失败: ${message}`, 500)
  }
}