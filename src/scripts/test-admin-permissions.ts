import { loginUser } from '../lib/auth'
import { prisma } from '../lib/prisma'

async function testAdminPermissions() {
  console.log('🔒 开始测试管理员权限...\n')

  try {
    // 测试管理员登录
    console.log('👨‍💼 测试管理员登录...')
    const adminLogin = await loginUser({
      username: 'admin',
      password: 'admin123456'
    })

    if (adminLogin && adminLogin.isAdmin) {
      console.log('✅ 管理员登录成功，权限正确')
    } else {
      console.log('❌ 管理员登录失败或权限错误')
    }

    // 测试普通用户登录
    console.log('\n👤 测试游客登录...')
    const guestLogin = await loginUser({
      username: 'guest',
      password: 'guest123456'
    })

    if (guestLogin && !guestLogin.isAdmin) {
      console.log('✅ 游客登录成功，权限正确（非管理员）')
    } else {
      console.log('❌ 游客登录失败或权限错误')
    }

    // 检查数据库中的用户权限设置
    console.log('\n🗄️ 检查数据库中的用户权限...')

    const adminUser = await prisma.user.findUnique({
      where: { username: 'admin' },
      select: { id: true, username: true, isAdmin: true, isActive: true }
    })

    const guestUser = await prisma.user.findUnique({
      where: { username: 'guest' },
      select: { id: true, username: true, isAdmin: true, isActive: true }
    })

    if (adminUser) {
      console.log(`✅ 管理员账号: ${adminUser.username} | 管理员权限: ${adminUser.isAdmin ? '是' : '否'} | 激活状态: ${adminUser.isActive ? '是' : '否'}`)
    } else {
      console.log('❌ 未找到管理员账号')
    }

    if (guestUser) {
      console.log(`✅ 游客账号: ${guestUser.username} | 管理员权限: ${guestUser.isAdmin ? '是' : '否'} | 激活状态: ${guestUser.isActive ? '是' : '否'}`)
    } else {
      console.log('❌ 未找到游客账号')
    }

    console.log('\n🎯 权限测试总结:')
    console.log('• 管理员账号应该能访问 /dashboard')
    console.log('• 游客账号访问 /dashboard 会被拒绝')
    console.log('• 未登录用户访问 /dashboard 会被重定向到登录页面')
    console.log('• 所有权限错误都会显示相应的提示信息')

    console.log('\n🌐 在浏览器中测试:')
    console.log('1. 用管理员账号登录后访问 http://localhost:3000/dashboard')
    console.log('2. 用游客账号登录后访问 http://localhost:3000/dashboard')
    console.log('3. 直接访问 http://localhost:3000/dashboard (未登录状态)')

  } catch (error) {
    console.error('❌ 权限测试失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行测试
if (require.main === module) {
  testAdminPermissions()
}

export { testAdminPermissions }