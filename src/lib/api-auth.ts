import { NextRequest } from 'next/server'
import { verifyToken } from './auth'

// 从请求中获取用户ID
export function getUserIdFromRequest(request: NextRequest): number | null {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return null
  }

  // 验证 token
  const decoded = verifyToken(token)
  return decoded?.userId || null
}

// 检查请求是否已认证
export function isAuthenticated(request: NextRequest): { success: boolean; userId?: number; error?: string } {
  const userId = getUserIdFromRequest(request)

  if (!userId) {
    return { success: false, error: '未提供认证令牌' }
  }

  return { success: true, userId }
}

// API路由认证包装器
export function withAuth(handler: (request: NextRequest, context: { userId: number }) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const auth = isAuthenticated(request)

    if (!auth.success) {
      return new Response(
        JSON.stringify({ success: false, message: auth.error }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return handler(request, { userId: auth.userId! })
  }
}