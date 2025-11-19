import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/lib/services/post-service'
import { auth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 获取当前用户
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: '用户未认证' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const { slug } = resolvedParams

    if (!slug) {
      return NextResponse.json(
        { success: false, message: '文章slug不能为空' },
        { status: 400 }
      )
    }

    // 获取文章详情（编辑模式不需要增加浏览量）
    const post = await PostService.getPostBySlug(slug, false)

    if (!post) {
      return NextResponse.json(
        { success: false, message: '文章不存在' },
        { status: 404 }
      )
    }

    // 检查权限（只有作者或管理员可以编辑）
    if (post.author && post.author.id !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: '没有权限编辑此文章' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '获取文章成功',
      data: { post }
    })

  } catch (error) {
    console.error('Error fetching admin post:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取文章失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}