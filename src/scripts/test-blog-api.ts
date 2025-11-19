async function testBlogAPI() {
  const baseUrl = 'http://localhost:3000'

  console.log('🧪 开始测试博客API...\n')

  try {
    // 测试获取文章列表
    console.log('📝 测试文章列表API...')
    const postsResponse = await fetch(`${baseUrl}/api/posts`)
    const postsData = await postsResponse.json()

    if (postsData.success) {
      console.log('✅ 文章列表API成功')
      console.log(`   - 获取到 ${postsData.data.posts.length} 篇文章`)
      console.log(`   - 总页数: ${postsData.data.pagination.totalPages}`)
      console.log(`   - 当前页: ${postsData.data.pagination.page}`)
    } else {
      console.log('❌ 文章列表API失败:', postsData.error?.message)
    }

    // 测试获取分类列表
    console.log('\n📁 测试分类列表API...')
    const categoriesResponse = await fetch(`${baseUrl}/api/categories`)
    const categoriesData = await categoriesResponse.json()

    if (categoriesData.success) {
      console.log('✅ 分类列表API成功')
      console.log(`   - 获取到 ${categoriesData.data.length} 个分类`)
      categoriesData.data.forEach((cat: any) => {
        console.log(`   - ${cat.name} (${cat.postCount} 篇文章)`)
      })
    } else {
      console.log('❌ 分类列表API失败:', categoriesData.error?.message)
    }

    // 测试获取分类详情（如果第一个分类存在）
    if (categoriesData.success && categoriesData.data.length > 0) {
      console.log('\n📂 测试分类详情API...')
      const firstCategory = categoriesData.data[0]
      const categoryResponse = await fetch(`${baseUrl}/api/categories/${firstCategory.slug}`)
      const categoryData = await categoryResponse.json()

      if (categoryData.success) {
        console.log('✅ 分类详情API成功')
        console.log(`   - 分类名称: ${categoryData.data.name}`)
        console.log(`   - 文章数量: ${categoryData.data.postCount}`)
      } else {
        console.log('❌ 分类详情API失败:', categoryData.error?.message)
      }
    }

    // 测试文章详情（如果第一篇文章存在）
    if (postsData.success && postsData.data.posts.length > 0) {
      console.log('\n📖 测试文章详情API...')
      const firstPost = postsData.data.posts[0]
      const postResponse = await fetch(`${baseUrl}/api/posts/${firstPost.slug}`)
      const postData = await postResponse.json()

      if (postData.success) {
        console.log('✅ 文章详情API成功')
        console.log(`   - 文章标题: ${postData.data.title}`)
        console.log(`   - 作者: ${postData.data.author?.displayName || 'Unknown'}`)
        console.log(`   - 分类数量: ${postData.data.categories.length}`)
        console.log(`   - 标签数量: ${postData.data.tags.length}`)
        console.log(`   - 浏览量: ${postData.data.viewCount}`)
      } else {
        console.log('❌ 文章详情API失败:', postData.error?.message)
      }
    }

    // 测试带参数的文章列表
    console.log('\n🔍 测试带参数的文章列表API...')
    const searchResponse = await fetch(`${baseUrl}/api/posts?limit=5&featured=true&sortBy=title`)
    const searchData = await searchResponse.json()

    if (searchData.success) {
      console.log('✅ 带参数的文章列表API成功')
      console.log(`   - 获取到 ${searchData.data.posts.length} 篇特色文章`)
      console.log(`   - 每页限制: ${searchData.data.pagination.limit}`)
    } else {
      console.log('❌ 带参数的文章列表API失败:', searchData.error?.message)
    }

    console.log('\n🎯 API测试总结:')
    console.log('• 文章列表 API: GET /api/posts')
    console.log('• 文章详情 API: GET /api/posts/[slug]')
    console.log('• 分类列表 API: GET /api/categories')
    console.log('• 分类详情 API: GET /api/categories/[slug]')
    console.log('• 支持的查询参数: page, limit, status, featured, search, sortBy, sortOrder')

    console.log('\n✨ 使用示例:')
    console.log(`curl "${baseUrl}/api/posts"`)
    console.log(`curl "${baseUrl}/api/posts?page=1&limit=5&featured=true"`)
    console.log(`curl "${baseUrl}/api/posts/search?q=nextjs"`)
    console.log(`curl "${baseUrl}/api/categories"`)
    console.log(`curl "${baseUrl}/api/categories/tech?posts=true"`)

  } catch (error) {
    console.error('❌ API测试失败:', error)
    console.log('\n💡 请确保:')
    console.log('1. 开发服务器正在运行 (pnpm dev)')
    console.log('2. 数据库已初始化 (pnpm db:seed)')
    console.log('3. 数据库连接正常')
  }
}

// 运行测试
if (require.main === module) {
  testBlogAPI()
}

export { testBlogAPI }