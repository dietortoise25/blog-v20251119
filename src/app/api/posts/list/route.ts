import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/lib/services/post-service'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 获取当前用户
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: '用户未认证' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { page = 1, limit = 10, status, search, sortBy = 'updatedAt', sortOrder = 'desc' } = body

    // 获取文章列表（管理员可以看到所有状态的文章）
    const result = await PostService.getPosts({
      page,
      limit,
      status, // 允许获取所有状态的文章用于管理
      search,
      sortBy,
      sortOrder
    })

    return NextResponse.json({
      success: true,
      message: '获取文章列表成功',
      data: result
    })

  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取文章列表失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}