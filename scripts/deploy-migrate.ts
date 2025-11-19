#!/usr/bin/env tsx

/**
 * 生产环境数据库迁移脚本
 * 用于Vercel部署时自动运行数据库迁移
 */

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateDatabase() {
  try {
    console.log('🚀 开始数据库迁移...')

    // 生成Prisma客户端
    console.log('📦 生成Prisma客户端...')
    execSync('pnpm prisma generate', { stdio: 'inherit' })

    // 运行数据库迁移
    console.log('🔄 运行数据库迁移...')
    execSync('pnpm prisma db push --accept-data-loss', { stdio: 'inherit' })

    // 检查数据库连接
    console.log('🔗 测试数据库连接...')
    await prisma.$connect()

    // 检查必要的数据是否存在
    const postCount = await prisma.post.count()
    console.log(`📊 数据库状态：当前有 ${postCount} 篇文章`)

    console.log('✅ 数据库迁移完成！')

  } catch (error) {
    console.error('❌ 数据库迁移失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  migrateDatabase()
}

export default migrateDatabase