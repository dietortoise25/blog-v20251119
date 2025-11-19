import { NextRequest } from 'next/server'
import { PostService } from '@/lib/services/post-service'
import { successResponse, errorResponse } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return errorResponse('文章slug不能为空', 400)
    }

    // 获取查询参数，控制是否增加浏览量
    const { searchParams } = new URL(request.url)
    const incrementView = searchParams.get('view') !== 'false'

    // 获取文章详情
    const post = await PostService.getPostBySlug(slug, incrementView)

    if (!post) {
      return errorResponse('文章不存在', 404)
    }

    return successResponse(post, '获取文章详情成功')
  } catch (error) {
    console.error('Error in GET /api/posts/[slug]:', error)

    const message = error instanceof Error ? error.message : '未知错误'
    return errorResponse(`获取文章详情失败: ${message}`, 500)
  }
}

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // 这里可以添加更新文章的逻辑
    // 暂时返回405 Method Not Allowed
    return errorResponse('方法不允许', 405)
  } catch (error) {
    console.error('Error in PUT /api/posts/[slug]:', error)

    const message = error instanceof Error ? error.message : '未知错误'
    return errorResponse(`更新文章失败: ${message}`, 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // 这里可以添加删除文章的逻辑
    // 暂时返回405 Method Not Allowed
    return errorResponse('方法不允许', 405)
  } catch (error) {
    console.error('Error in DELETE /api/posts/[slug]:', error)

    const message = error instanceof Error ? error.message : '未知错误'
    return errorResponse(`删除文章失败: ${message}`, 500)
  }
}