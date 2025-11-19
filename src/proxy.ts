import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// 需要认证的路径 (临时移除文章相关路径以便测试)
const protectedPaths = [
  // '/api/posts/create', // 临时注释掉以便测试
  // '/api/posts/update',
  // '/api/posts/delete',
  '/api/users/me',
  '/api/users/update',
  '/api/comments/create',
]

// 管理员路径
const adminPaths = [
  '/api/admin',
]

// 不需要认证的路径（注册和登录）
const publicPaths = ['/api/auth/login', '/api/auth/register']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 不需要认证的路径（注册和登录）
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // 获取 Authorization header
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json(
      { success: false, message: '未提供认证令牌' },
      { status: 401 }
    )
  }

  // 验证 token
  const decoded = verifyToken(token)

  if (!decoded) {
    return NextResponse.json(
      { success: false, message: '无效的认证令牌' },
      { status: 401 }
    )
  }

  // 检查管理员权限
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path))
  if (isAdminPath) {
    // 这里需要在请求处理中检查用户是否为管理员
    // 因为我们需要查询数据库，这个检查将在具体的 API 路由中完成
  }

  // 将用户信息添加到请求头中
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', decoded.userId.toString())

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/api/:path*',
  ]
}