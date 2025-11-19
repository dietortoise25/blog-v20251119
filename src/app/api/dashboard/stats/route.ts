import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/lib/services/post-service'
import { CategoryService } from '@/lib/services/category-service'

export async function GET() {
  try {
    // 获取文章统计
    const postsData = await PostService.getPosts({
      page: 1,
      limit: 1, // 只需要统计数据
      status: undefined,
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    })

    // 获取分类统计
    const categoriesData = await CategoryService.getAllCategories()

    // 获取今日发布的文章数量
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

    const todayPostsData = await PostService.getPosts({
      page: 1,
      limit: 10, // 减少到10以避免任何验证问题
      status: 'published',
      publishedAfter: todayStart.toISOString(),
      publishedBefore: todayEnd.toISOString(),
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    })

    // 计算统计数据
    const stats = {
      totalPosts: postsData.pagination.total,
      totalViews: postsData.posts.reduce((sum, post) => sum + post.viewCount, 0),
      totalCategories: categoriesData?.length || 0,
      publishedToday: todayPostsData.pagination.total,
      totalPublished: postsData.posts.filter(p => p.status === 'published').length,
      totalDrafts: postsData.posts.filter(p => p.status === 'draft').length,
      systemStatus: 'online',
      lastUpdated: new Date().toISOString()
    }

    // 获取最近文章（最新5篇）
    const recentPostsData = await PostService.getPosts({
      page: 1,
      limit: 5,
      status: undefined,
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    })

    const recentPosts = recentPostsData.posts.map(post => ({
      id: post.id.toString(),
      title: post.title,
      slug: post.slug,
      status: post.status,
      date: new Date(post.updatedAt).toLocaleDateString('zh-CN'),
      views: post.viewCount
    }))

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentPosts
      }
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取统计数据失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}