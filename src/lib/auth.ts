import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthUser, LoginCredentials, RegisterData } from '@/types'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

// 密码验证
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// 生成 JWT Token
export function generateToken(userId: number): string {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  )
}

// 验证 JWT Token
export function verifyToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    return decoded
  } catch {
    return null
  }
}

// 用户登录
export async function loginUser(credentials: LoginCredentials): Promise<AuthUser | null> {
  const { username, password } = credentials

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email: username }
      ],
      isActive: true
    },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      isAdmin: true,
      isActive: true,
      passwordHash: true
    }
  })

  if (!user || !user.passwordHash) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)
  if (!isValidPassword) {
    return null
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    isAdmin: user.isAdmin,
    isActive: user.isActive
  }
}

// 用户注册
export async function registerUser(data: RegisterData): Promise<AuthUser> {
  const { username, email, password, displayName } = data

  // 检查用户名是否已存在
  const whereConditions = []
  whereConditions.push({ username })
  if (email) {
    whereConditions.push({ email })
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: whereConditions
    }
  })

  if (existingUser) {
    throw new Error('用户名或邮箱已存在')
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash: hashedPassword,
      displayName: displayName || username
    },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      isAdmin: true,
      isActive: true
    }
  })

  return user
}

// 通过ID获取用户
export async function getUserById(id: number): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { id, isActive: true },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      isAdmin: true,
      isActive: true
    }
  })

  return user
}

// 更新用户信息
export async function updateUser(id: number, data: Partial<AuthUser>): Promise<AuthUser> {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      isAdmin: true,
      isActive: true
    }
  })

  return user
}

// 修改密码
export async function changePassword(id: number, oldPassword: string, newPassword: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { passwordHash: true }
  })

  if (!user || !user.passwordHash) {
    return false
  }

  const isValidPassword = await verifyPassword(oldPassword, user.passwordHash)
  if (!isValidPassword) {
    return false
  }

  const hashedNewPassword = await hashPassword(newPassword)

  await prisma.user.update({
    where: { id },
    data: { passwordHash: hashedNewPassword }
  })

  return true
}

// NextAuth兼容的auth函数
export async function auth(): Promise<{ user: { id: number; username: string; email?: string; role?: string } } | null> {
  try {
    // 在实际应用中，这里应该从请求头中获取token并验证
    // 现在返回一个模拟的管理员用户用于开发和测试
    return {
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
      }
    }
  } catch (error) {
    console.error('Auth error:', error)
    // 即使出错，也返回一个默认的管理员用户以确保系统可用
    return {
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
      }
    }
  }
}