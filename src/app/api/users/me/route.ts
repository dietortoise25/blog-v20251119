import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    // 从请求头中获取用户 ID (由proxy设置)
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        errorResponse('未认证'),
        { status: 401 }
      )
    }

    // 获取用户信息
    const user = await getUserById(parseInt(userId, 10))

    if (!user) {
      return NextResponse.json(
        errorResponse('用户不存在'),
        { status: 404 }
      )
    }

    return NextResponse.json(
      successResponse(user, '获取用户信息成功'),
      { status: 200 }
    )

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      errorResponse('获取用户信息失败', error instanceof Error ? error.message : '未知错误'),
      { status: 500 }
    )
  }
}