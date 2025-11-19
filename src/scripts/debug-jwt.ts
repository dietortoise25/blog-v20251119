import { generateToken, verifyToken } from '../lib/auth.js'

// 模拟用户
const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  displayName: 'Test User',
  isAdmin: false,
  createdAt: new Date()
}

console.log('🔐 JWT Token 调试测试')
console.log('JWT_SECRET:', process.env.JWT_SECRET)

// 生成token
const token = generateToken(mockUser.id)
console.log('✅ 生成的Token:', token)
console.log('Token长度:', token.length)

// 验证token
console.log('\n🔍 验证Token...')
const decoded = verifyToken(token)
if (decoded) {
  console.log('✅ Token验证成功!')
  console.log('用户ID:', decoded.userId)
  console.log('用户ID类型:', typeof decoded.userId)
} else {
  console.log('❌ Token验证失败')
}

// 测试错误的token
console.log('\n🚫 测试错误的Token...')
const wrongToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjF9.invalid'
const wrongDecoded = verifyToken(wrongToken)
if (wrongDecoded) {
  console.log('✅ 错误Token验证成功 (不应该!)')
} else {
  console.log('✅ 错误Token验证失败 (符合预期)')
}