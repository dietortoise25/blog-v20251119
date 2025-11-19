import { NextRequest, NextResponse } from 'next/server'
import { loginUser, generateToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import { successResponse, errorResponse } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求数据
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        errorResponse('请求数据格式错误', validation.error.message),
        { status: 400 }
      )
    }

    const { username, password } = validation.data

    // 登录用户
    const user = await loginUser({ username, password })

    if (!user) {
      return NextResponse.json(
        errorResponse('用户名或密码错误'),
        { status: 401 }
      )
    }

    // 生成 token
    const token = generateToken(user.id)

    return NextResponse.json(
      successResponse({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          isAdmin: user.isAdmin,
        },
        token
      }, '登录成功'),
      { status: 200 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      errorResponse('登录失败', error instanceof Error ? error.message : '未知错误'),
      { status: 500 }
    )
  }
}