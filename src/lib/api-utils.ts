import { NextResponse } from 'next/server'

/**
 * 成功响应
 */
export function successResponse<T>(data: T, message = '操作成功') {
  return NextResponse.json({
    success: true,
    data,
    message
  })
}

/**
 * 错误响应
 */
export function errorResponse(message: string, statusCode = 400, details?: any) {
  return NextResponse.json({
    success: false,
    error: {
      message,
      details
    }
  }, { status: statusCode })
}

/**
 * 从URL中获取查询参数
 */
export function getQueryParams(request: Request) {
  const { searchParams } = new URL(request.url)
  const params: Record<string, string | string[]> = {}

  searchParams.forEach((value, key) => {
    // 处理多值参数（如tags）
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value)
      } else {
        params[key] = [params[key] as string, value]
      }
    } else {
      params[key] = value
    }
  })

  return params
}

/**
 * 验证必需的查询参数
 */
export function validateRequiredParams(params: Record<string, any>, required: string[]) {
  const missing = required.filter(key => !params[key])

  if (missing.length > 0) {
    throw new Error(`缺少必需参数: ${missing.join(', ')}`)
  }
}

/**
 * 处理Prisma错误
 */
export function handlePrismaError(error: any): { message: string; statusCode: number } {
  console.error('Prisma error:', error)

  // Prisma已知错误
  if (error.code === 'P2002') {
    return {
      message: '数据已存在，请检查唯一性约束',
      statusCode: 409
    }
  }

  if (error.code === 'P2025') {
    return {
      message: '记录不存在',
      statusCode: 404
    }
  }

  if (error.code === 'P2003') {
    return {
      message: '外键约束失败',
      statusCode: 400
    }
  }

  // 通用错误
  return {
    message: '数据库操作失败',
    statusCode: 500
  }
}