import { NextRequest, NextResponse } from 'next/server'
import { registerUser, generateToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { successResponse, errorResponse } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求数据
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        errorResponse('请求数据格式错误', validation.error.message),
        { status: 400 }
      )
    }

    // 注册用户
    const user = await registerUser(validation.data)

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
      }, '注册成功'),
      { status: 201 }
    )

  } catch (error) {
    console.error('Register error:', error)

    const message = error instanceof Error ? error.message : '未知错误'
    const statusCode = message === '用户名或邮箱已存在' ? 409 : 500

    return NextResponse.json(
      errorResponse('注册失败', message),
      { status: statusCode }
    )
  }
}