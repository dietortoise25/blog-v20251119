import { NextRequest } from 'next/server'
import { CategoryService } from '@/lib/services/category-service'
import { successResponse, errorResponse } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('stats') === 'true'

    let result

    if (includeStats) {
      // 包含统计信息
      const [categories, stats] = await Promise.all([
        CategoryService.getAllCategories(),
        CategoryService.getCategoryStats()
      ])

      result = {
        categories,
        stats
      }
    } else {
      // 仅获取分类列表
      result = await CategoryService.getAllCategories()
    }

    return successResponse(result, '获取分类列表成功')
  } catch (error) {
    console.error('Error in GET /api/categories:', error)

    const message = error instanceof Error ? error.message : '未知错误'
    return errorResponse(`获取分类列表失败: ${message}`, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // 这里可以添加创建分类的逻辑
    // 暂时返回405 Method Not Allowed
    return errorResponse('方法不允许', 405)
  } catch (error) {
    console.error('Error in POST /api/categories:', error)

    const message = error instanceof Error ? error.message : '未知错误'
    return errorResponse(`创建分类失败: ${message}`, 500)
  }
}