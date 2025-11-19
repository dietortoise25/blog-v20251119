import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/lib/services/post-service'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // 验证请求数据
    const { title, slug, content, excerpt, status, categoryIds, tagIds } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, message: '标题、链接和内容为必填项' },
        { status: 400 }
      )
    }

    // 检查slug是否已存在
    const existingPost = await PostService.getPostBySlug(slug, false)
    if (existingPost) {
      return NextResponse.json(
        { success: false, message: '文章链接已存在' },
        { status: 409 }
      )
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

    // 创建文章
    const post = await PostService.createPost({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      status: status || 'draft',
      authorId: session.user.id,
      featured: false,
      categoryIds: categoryIds || [],
      tagIds: processedTagIds
    })

    return NextResponse.json({
      success: true,
      message: '文章创建成功',
      data: post
    })

  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      {
        success: false,
        message: '创建文章失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}