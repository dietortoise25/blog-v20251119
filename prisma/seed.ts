import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始数据库种子数据初始化...");

  try {
    // 创建默认管理员账号
    console.log("👨‍💼 创建管理员账号...");

    const adminPassword = await hashPassword("admin123456"); // 请修改为安全密码

    const admin = await prisma.user.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        username: "admin",
        email: "alan@blog.com",
        passwordHash: adminPassword,
        displayName: "Alan",
        bio: "这是博客的管理员账号",
        isAdmin: true,
        isActive: true,
      },
    });

    console.log(`✅ 管理员账号创建成功: ${admin.username}`);

    // 创建游客测试账号
    console.log("👤 创建游客测试账号...");

    const guestPassword = await hashPassword("guest123456");

    const guest = await prisma.user.upsert({
      where: { username: "guest" },
      update: {},
      create: {
        username: "guest",
        email: "guest@example.com",
        passwordHash: guestPassword,
        displayName: "游客用户",
        bio: "这是用于测试的游客账号，具有普通用户权限",
        isAdmin: false,
        isActive: true,
        website: "https://example.com",
        githubUsername: "guestuser",
        twitterUsername: "guestuser",
      },
    });

    console.log(`✅ 游客账号创建成功: ${guest.username}`);

    // 创建默认分类
    console.log("📁 创建默认分类...");

    const categories = [
      {
        name: "技术分享",
        slug: "tech",
        description: "技术相关的文章分享",
        color: "#3B82F6",
        icon: "code",
      },
      {
        name: "生活随笔",
        slug: "life",
        description: "日常生活和感悟",
        color: "#10B981",
        icon: "heart",
      },
      {
        name: "项目展示",
        slug: "projects",
        description: "个人项目和作品展示",
        color: "#8B5CF6",
        icon: "rocket",
      },
    ];

    for (const categoryData of categories) {
      const category = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: {},
        create: categoryData,
      });
      console.log(`✅ 分类创建成功: ${category.name}`);
    }

    // 创建默认标签
    console.log("🏷️ 创建默认标签...");

    const tags = [
      { name: "JavaScript", slug: "javascript" },
      { name: "TypeScript", slug: "typescript" },
      { name: "React", slug: "react" },
      { name: "Next.js", slug: "nextjs" },
      { name: "Node.js", slug: "nodejs" },
      { name: "Prisma", slug: "prisma" },
      { name: "Tailwind CSS", slug: "tailwindcss" },
      { name: "前端", slug: "frontend" },
      { name: "后端", slug: "backend" },
      { name: "全栈", slug: "fullstack" },
    ];

    for (const tagData of tags) {
      const tag = await prisma.tag.upsert({
        where: { slug: tagData.slug },
        update: {},
        create: tagData,
      });
      console.log(`✅ 标签创建成功: ${tag.name}`);
    }

    // 创建示例文章
    console.log("📝 创建示例文章...");

    const techCategory = await prisma.category.findUnique({
      where: { slug: "tech" },
    });
    const lifeCategory = await prisma.category.findUnique({
      where: { slug: "life" },
    });
    const projectsCategory = await prisma.category.findUnique({
      where: { slug: "projects" },
    });

    // 获取所有标签
    const allTags = await prisma.tag.findMany();
    const tagMap = new Map(allTags.map((tag) => [tag.slug, tag]));

    // 扩展文章数据
    const posts = [
      {
        title: "Hello World - 我的第一篇博客",
        slug: "hello-world",
        category: techCategory?.slug,
        tags: ["javascript", "react"],
        content: `# 欢迎来到我的博客！

这是我的第一篇博客文章。在这个博客中，我将分享我的技术学习心得、项目经验和生活感悟。

## 关于这个博客

这个博客使用以下技术栈构建：
- **前端**: Next.js 16 + React 19 + TypeScript
- **样式**: Tailwind CSS + Shadcn/ui
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT + bcryptjs

## 博客特色

- 🎨 赛博朋克风格的UI设计
- 📱 完全响应式设计
- 🌙 支持深色/浅色主题切换
- ⚡ 高性能的SSR和SSG
- 🔍 强大的搜索功能
- 💬 互动评论系统

感谢你的访问，希望你能在这里找到有用的内容！`,
        excerpt:
          "欢迎来到我的个人博客！这里将分享技术心得、项目经验和生活感悟。",
        featured: true,
      },
      {
        title: "React Hooks 深度解析",
        slug: "react-hooks-deep-dive",
        category: techCategory?.slug,
        tags: ["react", "javascript", "frontend"],
        content: `# React Hooks 深度解析

React Hooks 是 React 16.8 引入的新特性，它让你无需编写类组件就能使用 state 和其他 React 特性。

## useState Hook

useState 是最基本的 Hook，用于在函数组件中添加状态。

\`\`\`javascript
const [count, setCount] = useState(0)
\`\`\`

## useEffect Hook

useEffect 用于处理副作用，比如数据获取、订阅、手动更改 DOM 等。

\`\`\`javascript
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 清理函数
  }
}, [dependencies])
\`\`\`

## 自定义 Hooks

你可以创建自己的 Hooks 来复用状态逻辑：

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  return { count, increment, decrement }
}
\`\`\``,
        excerpt:
          "深入理解 React Hooks 的工作原理和最佳实践，包括 useState、useEffect 和自定义 Hook。",
        featured: false,
      },
      {
        title: "TypeScript 类型系统完全指南",
        slug: "typescript-complete-guide",
        category: techCategory?.slug,
        tags: ["typescript", "javascript", "frontend"],
        content: `# TypeScript 类型系统完全指南

TypeScript 是 JavaScript 的超集，它添加了静态类型检查。

## 基础类型

\`\`\`typescript
let isDone: boolean = false
let decimal: number = 6
let color: string = "blue"
\`\`\`

## 接口和类型别名

\`\`\`typescript
interface User {
  name: string
  age: number
}

type ID = string | number
\`\`\`

## 泛型

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}
\`\`\`

## 高级类型

- 联合类型
- 交叉类型
- 条件类型
- 映射类型`,
        excerpt:
          "全面掌握 TypeScript 的类型系统，从基础类型到高级特性的完整指南。",
        featured: true,
      },
      {
        title: "Next.js 13 App Router 新特性",
        slug: "nextjs-13-app-router",
        category: techCategory?.slug,
        tags: ["nextjs", "react", "frontend"],
        content: `# Next.js 13 App Router 新特性

Next.js 13 引入了全新的 App Router，带来了许多令人兴奋的新特性。

## Server Components

默认情况下，所有组件都是 React Server Components：

\`\`\`typescript
// Server Component
async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
\`\`\`

## 数据获取

使用新的数据获取模式：

\`\`\`typescript
async function Page() {
  const posts = await fetch('https://api.example.com/posts')
  return <PostList posts={posts} />
}
\`\`\`

## 路由组织

文件系统路由更加直观和强大。

## 布局系统

支持共享布局和嵌套布局。`,
        excerpt:
          "探索 Next.js 13 App Router 的新特性，包括 Server Components、新的数据获取模式和路由系统。",
        featured: false,
      },
      {
        title: "Tailwind CSS 实用技巧",
        slug: "tailwind-css-tips",
        category: techCategory?.slug,
        tags: ["tailwindcss", "css", "frontend"],
        content: `# Tailwind CSS 实用技巧

Tailwind CSS 是一个功能强大的原子化 CSS 框架。

## 响应式设计

\`\`\`html
<div className="w-full md:w-1/2 lg:w-1/3">
  响应式容器
</div>
\`\`\`

## 状态样式

\`\`\`html
<button className="bg-blue-500 hover:bg-blue-700 focus:outline-none">
  按钮样式
</button>
\`\`\`

## 暗色模式

\`\`\`html
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  暗色模式支持
</div>
\`\`\`

## 自定义配置

通过 tailwind.config.js 自定义主题和插件。`,
        excerpt: "提升 Tailwind CSS 使用效率的实用技巧和最佳实践。",
        featured: false,
      },
      {
        title: "我的 2025 年学习计划",
        slug: "2025-learning-plan",
        category: lifeCategory?.slug,
        tags: ["fullstack"],
        content: `# 我的 2025 年学习计划

新的一年，新的目标！这是我 2025 年的技术学习计划。

## 技术栈深化

- **前端**: 深入 React 19 和 Next.js 16
- **后端**: 学习 Rust 和 Go 语言
- **数据库**: 掌握 PostgreSQL 高级特性
- **云服务**: AWS 和 Kubernetes 实践

## 软技能

- 技术写作能力
- 团队协作和沟通
- 项目管理
- 英语口语和写作

## 个人项目

1. 开源贡献：每月至少一个 PR
2. 技术博客：每周一篇文章
3. 开源项目：完成两个完整项目
4. 技术分享：参与技术社区活动

## 健康与平衡

- 保持规律作息
- 坚持运动锻炼
- 培养兴趣爱好
- 平衡工作与生活

希望到年底能实现这些目标！`,
        excerpt: "分享我的 2025 年学习计划，包括技术学习、个人项目和成长目标。",
        featured: false,
      },
      {
        title: "个人博客重构项目",
        slug: "personal-blog-refactor",
        category: projectsCategory?.slug,
        tags: ["nextjs", "typescript", "tailwindcss"],
        content: `# 个人博客重构项目

这是我个人博客的重构项目，使用现代化的技术栈重新构建。

## 技术选型

- **框架**: Next.js 16 with App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: PostgreSQL + Prisma
- **认证**: JWT + bcryptjs
- **部署**: Vercel

## 项目特色

### 1. 赛博朋克设计
- 终端风格的 UI 设计
- 霓虹色彩搭配
- 代码风格的交互效果

### 2. 性能优化
- SSR/SSG 混合渲染
- 图片优化和懒加载
- 代码分割和预加载

### 3. 响应式设计
- 移动端优先设计
- 完美适配各种屏幕
- 触摸友好的交互

## 项目结构

\`\`\`
src/
├── app/          # App Router 页面
├── components/   # React 组件
├── lib/          # 工具函数
├── types/        # TypeScript 类型
└── styles/       # 全局样式
\`\`\`

## 开发心得

通过这个项目，我深入学习了 Next.js 的新特性和现代前端开发的最佳实践。`,
        excerpt: "展示我的个人博客重构项目，介绍技术选型、项目特色和开发心得。",
        featured: true,
      },
      {
        title: "前端性能优化实践",
        slug: "frontend-performance-optimization",
        category: techCategory?.slug,
        tags: ["frontend", "performance", "javascript"],
        content: `# 前端性能优化实践

性能优化是前端开发中的重要环节，直接影响用户体验。

## 加载性能

### 1. 资源优化
- 图片压缩和格式选择
- 代码分割和懒加载
- 预加载和预获取

### 2. 缓存策略
- 浏览器缓存配置
- CDN 缓存优化
- Service Worker 缓存

## 运行时性能

### 1. JavaScript 优化
\`\`\`javascript
// 防抖和节流
const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
\`\`\`

### 2. 渲染优化
- 虚拟列表
- 避免不必要的重渲染
- 使用 requestAnimationFrame

## 监控和测量

- Web Vitals 指标
- 性能监控工具
- 用户体验指标

## 最佳实践

- 移动端优先
- 渐进式增强
- 性能预算设定`,
        excerpt: "全面的前端性能优化指南，包括加载优化、运行时优化和性能监控。",
        featured: false,
      },
      {
        title: "如何写出高质量代码",
        slug: "writing-high-quality-code",
        category: techCategory?.slug,
        tags: ["javascript", "typescript", "best-practices"],
        content: `# 如何写出高质量代码

高质量代码不仅功能正确，还要易于维护和扩展。

## 代码风格

### 1. 命名规范
\`\`\`javascript
// 好的命名
const getUserById = (id) => { ... }
const isValidEmail = (email) => { ... }

// 不好的命名
const getData = (x) => { ... }
const check = (a) => { ... }
\`\`\`

### 2. 函数设计
- 单一职责原则
- 纯函数优先
- 参数数量控制

## 代码组织

### 1. 模块化
\`\`\`javascript
// api.js
export const fetchUser = async (id) => { ... }
export const createUser = async (data) => { ... }

// userService.js
export const UserService = {
  async getProfile(id) { ... },
  async updateProfile(id, data) { ... }
}
\`\`\`

### 2. 分层架构
- 表现层
- 业务逻辑层
- 数据访问层

## 测试驱动

- 单元测试
- 集成测试
- 端到端测试

## 代码审查

- Peer Review 流程
- 代码质量检查
- 安全性审查`,
        excerpt:
          "编写高质量代码的原则和实践，包括命名规范、函数设计、模块化和测试。",
        featured: true,
      },
      {
        title: "远程工作一年总结",
        slug: "remote-work-summary",
        category: lifeCategory?.slug,
        tags: ["fullstack"],
        content: `# 远程工作一年总结

远程工作已经一年了，分享一下我的经验和感悟。

## 时间管理

### 工作节奏
- 固定的工作时间：9:00 - 18:00
- 明确的上下班仪式
- 合理的休息安排

### 番茄工作法
- 25 分钟专注工作
- 5 分钟短暂休息
- 每 4 个番茄钟长休息

## 环境布置

### 工作空间
- 独立的书房空间
- 人体工学椅和升降桌
- 双显示器配置
- 良好的光线和通风

### 网络环境
- 稳定的宽带连接
- 备用网络方案
- VPN 配置

## 团队协作

### 沟通工具
- Slack 日常沟通
- Zoom 视频会议
- Notion 文档协作
- GitHub 代码管理

### 异步协作
- 清晰的文档记录
- 定期的进度同步
- 透明的任务管理

## 个人成长

### 学习时间
- 通勤时间转化为学习时间
- 更灵活的时间安排
- 自主学习计划

### 健康管理
- 规律的作息
- 在家锻炼
- 眼睛和颈椎保护

## 挑战与克服

### 孤独感
- 定期线下聚会
- 参加技术社区
- 保持社交联系

### 自律性
- 建立工作仪式
- 排除干扰因素
- 自我激励机制

远程工作虽然有挑战，但整体来说是非常好的体验！`,
        excerpt:
          "分享远程工作一年的经验总结，包括时间管理、环境布置、团队协作和个人成长。",
        featured: false,
      },
      {
        title: "Node.js 后端开发最佳实践",
        slug: "nodejs-backend-best-practices",
        category: techCategory?.slug,
        tags: ["nodejs", "backend", "javascript"],
        content: `# Node.js 后端开发最佳实践

分享 Node.js 后端开发中的最佳实践和经验总结。

## 项目结构

\`\`\`
project/
├── src/
│   ├── controllers/  # 控制器层
│   ├── services/     # 业务逻辑层
│   ├── models/       # 数据模型
│   ├── middleware/   # 中间件
│   ├── routes/       # 路由定义
│   ├── utils/        # 工具函数
│   └── config/       # 配置文件
├── tests/            # 测试文件
└── docs/             # 文档
\`\`\`

## 错误处理

### 统一错误处理
\`\`\`javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // 记录错误
  console.error(err)

  // Mongoose 错误
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = new AppError(message, 404)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}
\`\`\`

## 数据验证

### 输入验证
\`\`\`javascript
const Joi = require('joi')

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})
\`\`\`

## 安全最佳实践

### 1. 环境变量
- 使用 .env 文件
- 敏感信息不提交到版本控制
- 生产环境独立配置

### 2. 数据库安全
- SQL 注入防护
- 数据库连接加密
- 定期备份

### 3. API 安全
- 认证和授权
- 请求频率限制
- CORS 配置

## 性能优化

### 1. 缓存策略
- Redis 缓存热点数据
- 设置合理的过期时间
- 缓存雪崩和穿透处理

### 2. 数据库优化
- 合理的索引设计
- 查询优化
- 连接池管理

## 测试策略

### 测试金字塔
- 单元测试（70%）
- 集成测试（20%）
- 端到端测试（10%）

### 测试工具
- Jest 单元测试
- Supertest API 测试
- MongoDB Memory Server

## 部署和监控

### 容器化
- Docker 镜像构建
- 多阶段构建优化
- 健康检查配置

### 监控和日志
- 应用性能监控
- 错误追踪
- 结构化日志`,
        excerpt:
          "全面的 Node.js 后端开发指南，涵盖项目结构、错误处理、安全实践和性能优化。",
        featured: true,
      },
      {
        title: "Prisma ORM 高级技巧",
        slug: "prisma-orm-advanced-tips",
        category: techCategory?.slug,
        tags: ["prisma", "database", "backend"],
        content: `# Prisma ORM 高级技巧

深入掌握 Prisma ORM 的高级特性和最佳实践。

## 关系查询

### 1. 预加载（Eager Loading）
\`\`\`typescript
// 获取用户及其文章
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: {
        categories: true
      }
    }
  }
})
\`\`\`

### 2. 嵌套查询
\`\`\`typescript
const result = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: true,
        categories: {
          some: {
            name: '技术'
          }
        }
      }
    }
  }
})
\`\`\`

## 事务处理

### 1. 事务 API
\`\`\`typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { name: 'John' }
  })

  const post = await tx.post.create({
    data: {
      title: 'Hello World',
      authorId: user.id
    }
  })

  return { user, post }
})
\`\`\`

### 2. 批量操作
\`\`\`typescript
const result = await prisma.$transaction([
  prisma.user.create({ data: user1 }),
  prisma.user.create({ data: user2 }),
  prisma.user.create({ data: user3 })
])
\`\`\`

## 查询优化

### 1. 索引优化
\`\`\`typescript
// 在 schema.prisma 中定义索引
model Post {
  id        Int    @id @default(autoincrement())
  title     String
  published Boolean
  createdAt DateTime @default(now())

  @@index([published, createdAt])
  @@index([title(sort: Desc)])
}
\`\`\`

### 2. 查询选择
\`\`\`typescript
// 只选择需要的字段
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    author: {
      select: {
        name: true
      }
    }
  }
})
\`\`\`

## 数据库迁移

### 1. 迁移管理
\`\`\`bash
# 创建迁移
npx prisma migrate dev --name add_new_field

# 重置数据库
npx prisma migrate reset

# 部署迁移
npx prisma migrate deploy
\`\`\`

### 2. 种子数据
\`\`\`typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com'
    }
  })
}

main()
\`\`\`

## 高级特性

### 1. 软删除
\`\`\`typescript
model Post {
  id        Int    @id @default(autoincrement())
  deletedAt DateTime?

  @@map("posts")
}

// 软删除
await prisma.post.update({
  where: { id: 1 },
  data: { deletedAt: new Date() }
})
\`\`\`

### 2. 多租户架构
\`\`\`typescript
// 数据库级别的多租户
const tenantPrisma = new PrismaClient({
  datasources: {
    db: {
      url: \`postgresql://...\${tenantId}\`
    }
  }
})
\`\`\`

## 性能监控

### 1. 查询日志
\`\`\`typescript
// 在 schema.prisma 中启用查询日志
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["query"]
}

// 监听查询事件
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})
\`\`\``,
        excerpt:
          "深入 Prisma ORM 的高级用法，包括关系查询、事务处理、性能优化和最佳实践。",
        featured: false,
      },
    ];

    // 创建文章
    console.log(`📝 创建 ${posts.length} 篇文章...`);

    for (let i = 0; i < posts.length; i++) {
      const postData = posts[i];
      if (!postData) {
        continue; // 跳过undefined项
      }

      const category =
        postData.category === "tech"
          ? techCategory
          : postData.category === "life"
          ? lifeCategory
          : postData.category === "projects"
          ? projectsCategory
          : techCategory;

      if (!category) {
        console.warn(`⚠️ 跳过文章 ${postData.title}，分类不存在`);
        continue;
      }

      // 创建文章
      const post = await prisma.post.upsert({
        where: { slug: postData.slug },
        update: {
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          updatedAt: new Date(),
        },
        create: {
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          excerpt: postData.excerpt,
          authorId: admin.id,
          status: "published",
          featured: postData.featured,
          readingTime: Math.max(2, Math.floor(postData.content.length / 1000)),
          category: category.name,
          publishDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // 每篇文章相隔一天
          readTime: `${Math.max(
            2,
            Math.floor(postData.content.length / 1000)
          )}分钟`,
          publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        },
      });

      // 关联分类
      await prisma.postCategory.upsert({
        where: {
          postId_categoryId: {
            postId: post.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          postId: post.id,
          categoryId: category.id,
        },
      });

      // 关联标签
      const postTags = postData.tags
        .map((tagSlug) => tagMap.get(tagSlug))
        .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined);
      if (postTags.length > 0) {
        await prisma.postTag.createMany({
          data: postTags.map((tag) => ({
            postId: post.id,
            tagId: tag.id,
          })),
          skipDuplicates: true,
        });
      }

      console.log(`✅ 文章创建成功: ${postData.title}`);
    }

    // 创建系统设置
    console.log("⚙️ 创建系统设置...");

    const settings = [
      {
        key: "site_title",
        value: "我的个人博客",
        type: "string",
        description: "网站标题",
        isPublic: true,
      },
      {
        key: "site_description",
        value: "分享技术心得和生活感悟的个人博客",
        type: "string",
        description: "网站描述",
        isPublic: true,
      },
      {
        key: "site_author",
        value: "博客作者",
        type: "string",
        description: "网站作者",
        isPublic: true,
      },
      {
        key: "allow_comments",
        value: "true",
        type: "boolean",
        description: "是否允许评论",
        isPublic: false,
      },
      {
        key: "posts_per_page",
        value: "10",
        type: "number",
        description: "每页显示文章数量",
        isPublic: false,
      },
    ];

    for (const settingData of settings) {
      const setting = await prisma.setting.upsert({
        where: { key: settingData.key },
        update: {},
        create: settingData,
      });
      console.log(`✅ 设置创建成功: ${setting.key}`);
    }

    console.log("\n🎉 数据库种子数据初始化完成！");
    console.log("\n📋 账号信息:");
    console.log("\n👨‍💼 管理员账号:");
    console.log("用户名: admin");
    console.log("邮箱: admin@blog.com");
    console.log("密码: admin123456");
    console.log("权限: 超级管理员");

    console.log("\n👤 游客测试账号:");
    console.log("用户名: guest");
    console.log("邮箱: guest@example.com");
    console.log("密码: guest123456");
    console.log("权限: 普通用户");
    console.log("GitHub: guestuser");
    console.log("Twitter: guestuser");

    console.log("\n⚠️  安全提醒:");
    console.log("• 请登录后立即修改管理员密码");
    console.log("• 游客账号仅用于测试，可在生产环境中删除");
    console.log("• 建议为个人博客关闭公开注册功能");
  } catch (error) {
    console.error("❌ 种子数据初始化失败:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 运行种子数据
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { main };
