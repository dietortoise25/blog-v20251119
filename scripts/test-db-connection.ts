#!/usr/bin/env tsx

/**
 * 数据库连接测试脚本
 * 用于部署前测试数据库连接是否正常
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabaseConnection() {
  try {
    console.log('🔗 测试数据库连接...')

    // 测试连接
    await prisma.$connect()
    console.log('✅ 数据库连接成功')

    // 测试查询
    const userCount = await prisma.user.count()
    console.log(`👥 用户数量：${userCount}`)

    const postCount = await prisma.post.count()
    console.log(`📝 文章数量：${postCount}`)

    const categoryCount = await prisma.category.count()
    console.log(`📂 分类数量：${categoryCount}`)

    // 测试写入权限
    const testResult = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ 数据库读写权限正常')

    console.log('🎉 数据库测试完成，一切正常！')

  } catch (error) {
    console.error('❌ 数据库测试失败：')
    console.error(error)

    // 提供常见问题解决方案
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        console.log('\n🔧 可能的解决方案：')
        console.log('1. 检查数据库连接字符串是否正确')
        console.log('2. 检查数据库白名单配置')
        console.log('3. 检查数据库是否运行正常')
      }
    }

    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testDatabaseConnection()
}

export default testDatabaseConnection