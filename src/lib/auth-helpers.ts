import { NextRequest } from 'next/server'
import { verifyToken } from './auth'

/**
 * 验证用户身份的辅助函数
 * 在需要认证的API路由中调用
 */
export async function authenticateRequest(request: NextRequest) {
  // 获取 Authorization header
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return {
      success: false,
      error: '未提供认证令牌',
      status: 401,
      userId: null
    }
  }

  // 验证 token
  const decoded = verifyToken(token)

  if (!decoded) {
    return {
      success: false,
      error: '无效的认证令牌',
      status: 401,
      userId: null
    }
  }

  return {
    success: true,
    error: null,
    status: 200,
    userId: decoded.userId
  }
}

/**
 * 验证管理员权限的辅助函数
 * 在需要管理员权限的API路由中调用
 */
export async function authenticateAdminRequest(request: NextRequest) {
  const auth = await authenticateRequest(request)

  if (!auth.success) {
    return auth
  }

  // 这里需要查询数据库检查用户是否为管理员
  // 为了避免在每个API中重复代码，我们可以返回用户ID让API自己检查
  return {
    ...auth,
    requiresAdminCheck: true
  }
}

/**
 * 从请求中提取用户ID（如果已认证）
 */
export function getUserIdFromRequest(request: NextRequest): number | null {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return null
  }

  try {
    const decoded = verifyToken(token)
    return decoded?.userId || null
  } catch {
    return null
  }
}