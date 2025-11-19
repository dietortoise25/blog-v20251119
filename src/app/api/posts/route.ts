import { NextRequest } from 'next/server'
import { PostService } from '@/lib/services/post-service'
import { getQueryParams, successResponse, errorResponse } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const params = getQueryParams(request)

    // 转换参数格式
    const query = {
      page: params.page ? parseInt(params.page as string) : 1,
      limit: params.limit ? parseInt(params.limit as string) : 10,
      status: params.status as "published" | "draft" | "archived" | undefined,
      featured: params.featured === 'true' ? true : params.featured === 'false' ? false : undefined,
      category: params.category as string,
      tags: Array.isArray(params.tags) ? params.tags : (params.tags ? [params.tags as string] : undefined),
      search: params.search as string,
      sortBy: (params.sortBy as "createdAt" | "updatedAt" | "title" | "viewCount" | "publishedAt") || 'publishedAt',
      sortOrder: (params.sortOrder as "asc" | "desc") || 'desc'
    }

    // 获取文章列表
    const result = await PostService.getPosts(query)

    return successResponse(result, '获取文章列表成功')
  } catch (error) {
    console.error('Error in GET /api/posts:', error)

    const message = error instanceof Error ? error.message : '未知错误'
    return errorResponse(`获取文章列表失败: ${message}`, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // 这里可以添加创建文章的逻辑
    // 暂时返回405 Method Not Allowed
    return errorResponse('方法不允许', 405)
  } catch (error) {
    console.error('Error in POST /api/posts:', error)

    const message = error instanceof Error ? error.message : '未知错误'
    return errorResponse(`创建文章失败: ${message}`, 500)
  }
}