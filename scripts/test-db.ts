import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabase() {
  console.log('🔍 测试Prisma PostgreSQL连接...\n')

  try {
    // 测试1: 检查连接
    await prisma.$connect()
    console.log('✅ 数据库连接成功!')

    // 测试2: 创建测试分类
    console.log('\n📝 创建测试分类...')
    const category = await prisma.category.create({
      data: {
        name: '技术',
        slug: 'tech',
        description: '技术相关文章',
        color: '#3B82F6'
      }
    })
    console.log('✅ 创建分类:', category.name)

    // 测试3: 创建测试用户
    console.log('\n👤 创建测试用户...')
    const user = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@blog.com',
        displayName: '博客管理员',
        isAdmin: true
      }
    })
    console.log('✅ 创建用户:', user.displayName)

    // 测试4: 创建测试文章
    console.log('\n📄 创建测试文章...')
    const post = await prisma.post.create({
      data: {
        title: '我的第一篇博客',
        slug: 'my-first-blog',
        content: '# 欢迎来到我的博客\n\n这是我的第一篇博客文章。',
        excerpt: '欢迎来到我的博客的第一篇文章',
        status: 'published',
        authorId: user.id,
        publishedAt: new Date()
      }
    })
    console.log('✅ 创建文章:', post.title)

    // 测试5: 关联文章和分类
    console.log('\n🔗 关联文章和分类...')
    await prisma.postCategory.create({
      data: {
        postId: post.id,
        categoryId: category.id
      }
    })
    console.log('✅ 文章分类关联成功')

    // 测试6: 查询数据
    console.log('\n📋 查询所有数据...')
    const allPosts = await prisma.post.findMany({
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    })

    console.log(`✅ 找到 ${allPosts.length} 篇文章:`)
    allPosts.forEach((post) => {
      console.log(`   - ${post.title} by ${post.author?.displayName}`)
      post.categories.forEach((pc) => {
        console.log(`     📁 分类: ${pc.category.name}`)
      })
    })

    console.log('\n🎉 所有测试通过！数据库工作正常。')
  } catch (error) {
    console.error('❌ 错误:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()