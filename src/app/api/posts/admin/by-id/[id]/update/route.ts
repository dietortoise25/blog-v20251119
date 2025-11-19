import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// 定义文章更新数据类型
interface PostUpdateData {
  title: string
  slug: string
  content: string
  excerpt: string | null
  status: 'draft' | 'published' | 'archived'
  updatedAt: Date
  publishedAt?: Date
}

export async function PUT(
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

    const body = await request.json()

    // 验证请求数据
    const { title, slug, content, excerpt, status, categoryIds, tagIds } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, message: '标题、链接和内容为必填项' },
        { status: 400 }
      )
    }

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        categories: true,
        tags: true
      }
    })

    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: '文章不存在' },
        { status: 404 }
      )
    }

    // 检查权限（只有作者或管理员可以更新）
    if (existingPost.authorId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: '没有权限更新此文章' },
        { status: 403 }
      )
    }

    // 如果slug改变了，检查新的slug是否已存在
    if (slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { success: false, message: '文章链接已存在' },
          { status: 409 }
        )
      }
    }

    // 准备更新数据
    const updateData: PostUpdateData = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      status: status || 'draft',
      updatedAt: new Date()
    }

    // 如果状态改为发布，设置发布时间
    if (status === 'published' && existingPost.status !== 'published') {
      updateData.publishedAt = new Date()
    }

    // 处理标签：将标签名称转换为标签ID
    let processedTagIds: number[] = []
    if (tagIds && tagIds.length > 0) {
      processedTagIds = await Promise.all(
        tagIds.map(async (tagName: string) => {
          // 查找或创建标签
          let tag = await prisma.tag.findUnique({
            where: { name: tagName }
          })

          if (!tag) {
            // 创建新标签
            tag = await prisma.tag.create({
              data: {
                name: tagName,
                slug: tagName.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
              }
            })
          }

          return tag.id
        })
      )
    }

    // 更新文章
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...updateData,
        categories: categoryIds && categoryIds.length > 0 ? {
          deleteMany: {},
          create: categoryIds.map((categoryId: number) => ({
            categoryId
          }))
        } : {
          deleteMany: {}
        },
        tags: processedTagIds.length > 0 ? {
          deleteMany: {},
          create: processedTagIds.map((tagId: number) => ({
            tagId
          }))
        } : {
          deleteMany: {}
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

    return NextResponse.json({
      success: true,
      message: '文章更新成功',
      data: updatedPost
    })

  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      {
        success: false,
        message: '更新文章失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}