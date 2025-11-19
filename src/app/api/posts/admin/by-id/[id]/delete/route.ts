import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/lib/services/post-service'
import { auth } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const postId = parseInt(resolvedParams.id)
    if (isNaN(postId)) {
      return NextResponse.json(
        { success: false, message: '无效的文章ID' },
        { status: 400 }
      )
    }

    // 检查文章是否存在
    const existingPost = await PostService.getPostById(postId)
    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: '文章不存在' },
        { status: 404 }
      )
    }

    // 检查权限（只有作者或管理员可以删除）
    if (existingPost.authorId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: '没有权限删除此文章' },
        { status: 403 }
      )
    }

    // 删除文章
    await PostService.deletePost(postId)

    return NextResponse.json({
      success: true,
      message: '文章删除成功'
    })

  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      {
        success: false,
        message: '删除文章失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}