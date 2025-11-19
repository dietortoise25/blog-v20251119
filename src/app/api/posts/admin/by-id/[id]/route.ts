import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/lib/services/post-service'
import { auth } from '@/lib/auth'

export async function GET(
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

    // 获取文章详情（编辑模式不需要增加浏览量）
    const post = await PostService.getPostById(postId)

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

    // 格式化返回数据
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
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

    return NextResponse.json({
      success: true,
      message: '获取文章成功',
      data: { post: formattedPost }
    })

  } catch (error) {
    console.error('Error fetching admin post by ID:', error)
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