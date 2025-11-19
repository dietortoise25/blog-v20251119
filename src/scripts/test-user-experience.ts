import { loginUser } from '../lib/auth'
import { prisma } from '../lib/prisma'

async function testUserExperience() {
  console.log('🧪 开始测试用户体验...\n')

  try {
    // 测试管理员登录和重定向
    console.log('👨‍💼 测试管理员用户体验...')
    const adminLogin = await loginUser({
      username: 'admin',
      password: 'admin123456'
    })

    if (adminLogin) {
      console.log('✅ 管理员登录成功')
      console.log('   用户名:', adminLogin.username)
      console.log('   管理员权限:', adminLogin.isAdmin ? '是' : '否')
      console.log('   应该重定向到: /dashboard')
    } else {
      console.log('❌ 管理员登录失败')
    }

    // 测试访客登录和重定向
    console.log('\n👤 测试访客用户体验...')
    const guestLogin = await loginUser({
      username: 'guest',
      password: 'guest123456'
    })

    if (guestLogin) {
      console.log('✅ 游客登录成功')
      console.log('   用户名:', guestLogin.username)
      console.log('   管理员权限:', guestLogin.isAdmin ? '是' : '否')
      console.log('   应该重定向到: / (首页)')
    } else {
      console.log('❌ 游客登录失败')
    }

    console.log('\n🎯 预期行为总结:')
    console.log('\n📱 导航栏显示:')
    console.log('• 未登录: 显示 "$ login" 按钮')
    console.log('• 访客登录后: 显示 "guest" 用户名 + "$ logout" 按钮')
    console.log('• 管理员登录后: 显示 "admin" 用户名 + "admin" 标签 + "$ admin" 按钮 + "$ logout" 按钮')

    console.log('\n🔄 登录重定向:')
    console.log('• 访客登录: 重定向到首页 (/)')
    console.log('• 管理员登录: 重定向到管理面板 (/dashboard)')

    console.log('\n🛡️ 权限控制:')
    console.log('• 访客无法访问 /dashboard (显示权限不足页面)')
    console.log('• 管理员可以访问所有页面')

    console.log('\n📱 移动端适配:')
    console.log('• 响应式设计，小屏幕隐藏部分信息')
    console.log('• 移动端显示折叠的用户信息区域')

    console.log('\n🌐 浏览器测试步骤:')
    console.log('1. 访问 http://localhost:3000')
    console.log('2. 点击导航栏的 "$ login"')
    console.log('3. 用游客账号登录: guest / guest123456')
    console.log('4. 验证重定向到首页，导航栏显示用户信息')
    console.log('5. 尝试访问 /dashboard，应该显示权限不足')
    console.log('6. 登出，然后用管理员账号登录: admin / admin123456')
    console.log('7. 验证重定向到管理面板，导航栏显示管理员信息')

    console.log('\n✨ 用户体验特色:')
    console.log('• 赛博朋克风格的终端命令设计')
    console.log('• 清晰的权限标识 (admin 标签)')
    console.log('• 平滑的页面切换动画')
    console.log('• 一致的视觉设计语言')

  } catch (error) {
    console.error('❌ 用户体验测试失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行测试
if (require.main === module) {
  testUserExperience()
}

export { testUserExperience }