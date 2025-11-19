const BASE_URL = 'http://localhost:3002'

async function testUserAPI() {
  console.log('🔐 测试登录获取Token...')

  // 先登录获取token
  const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'testuser',
      password: 'TestPassword123'
    })
  })

  const loginData = await loginResponse.json()

  console.log('📊 登录响应数据:', JSON.stringify(loginData, null, 2))

  if (!loginData.success) {
    console.log('❌ 登录失败:', loginData.message)
    return
  }

  const token = loginData.data.token
  console.log('✅ 获取到Token:', token)
  console.log('Token长度:', token.length)

  // 测试用户信息API
  console.log('\n👤 测试用户信息API...')

  const userResponse = await fetch(`${BASE_URL}/api/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })

  console.log('📊 响应状态:', userResponse.status)
  console.log('📊 响应Headers:')
  userResponse.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`)
  })

  const userData = await userResponse.json()
  console.log('📊 响应数据:', JSON.stringify(userData, null, 2))

  if (userData.success) {
    console.log('✅ 用户信息API工作正常!')
    console.log('用户名:', userData.data.username)
    console.log('邮箱:', userData.data.email)
  } else {
    console.log('❌ 用户信息API返回错误')
  }
}

testUserAPI().catch(console.error)