import { hashPassword, verifyPassword, generateToken, verifyToken } from '../lib/auth'
import { registerUser, loginUser } from '../lib/auth'
import { prisma } from '../lib/prisma'

async function testAuthFunctions() {
  console.log('🧪 开始测试认证功能...\n')

  try {
    // 测试密码加密和验证
    console.log('📝 测试密码功能...')
    const testPassword = 'TestPassword123'
    const hashedPassword = await hashPassword(testPassword)
    console.log('✅ 密码加密成功')

    const isValidPassword = await verifyPassword(testPassword, hashedPassword)
    console.log('✅ 密码验证:', isValidPassword ? '成功' : '失败')

    const isInvalidPassword = await verifyPassword('WrongPassword', hashedPassword)
    console.log('✅ 错误密码验证:', !isInvalidPassword ? '成功' : '失败')

    // 测试 JWT Token
    console.log('\n🔑 测试 JWT Token...')
    const testUserId = 1
    const token = generateToken(testUserId)
    console.log('✅ Token 生成成功:', token.substring(0, 20) + '...')

    const decoded = verifyToken(token)
    console.log('✅ Token 验证:', decoded ? `成功 (用户ID: ${decoded.userId})` : '失败')

    const invalidDecoded = verifyToken('invalid.token.here')
    console.log('✅ 无效Token验证:', !invalidDecoded ? '成功' : '失败')

    // 测试用户注册和登录
    console.log('\n👤 测试用户功能...')

    // 清理测试数据
    await prisma.user.deleteMany({
      where: { username: 'testuser' }
    }).catch(() => {})

    // 注册测试用户
    const testUserData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123',
      displayName: 'Test User'
    }

    const registeredUser = await registerUser(testUserData)
    console.log('✅ 用户注册成功:', registeredUser.username)

    // 测试登录
    const loginResult = await loginUser({
      username: 'testuser',
      password: 'TestPassword123'
    })
    console.log('✅ 用户登录成功:', loginResult ? loginResult.username : '失败')

    // 测试错误密码登录
    const failedLogin = await loginUser({
      username: 'testuser',
      password: 'WrongPassword'
    })
    console.log('✅ 错误密码登录:', !failedLogin ? '成功' : '失败')

    // 测试邮箱登录
    const emailLogin = await loginUser({
      username: 'test@example.com',
      password: 'TestPassword123'
    })
    console.log('✅ 邮箱登录成功:', emailLogin ? emailLogin.username : '失败')

    console.log('\n🎉 所有认证功能测试通过!')

  } catch (error) {
    console.error('❌ 测试失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行测试
if (require.main === module) {
  testAuthFunctions()
}

export { testAuthFunctions }