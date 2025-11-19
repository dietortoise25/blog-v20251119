// 用户相关类型
export interface User {
  id: number
  username: string
  email?: string
  displayName?: string
  bio?: string
  avatarUrl?: string
  website?: string
  githubUsername?: string
  twitterUsername?: string
  isActive: boolean
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: number
  username: string
  displayName?: string
  bio?: string
  avatarUrl?: string
  website?: string
  githubUsername?: string
  twitterUsername?: string
  postCount: number
  createdAt: Date
}

// 文章相关类型
export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  authorId?: number
  status: string
  featured: boolean
  viewCount: number
  likeCount: number
  commentCount: number
  readingTime?: number
  publishDate?: string // 格式化的发布日期 "2025-01-18"
  readTime?: string // 格式化的阅读时间 "8 分钟"
  category?: string // 简化的分类字段
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date

  // 关联数据
  author?: User
  categories?: Category[]
  tags?: Tag[]
  comments?: Comment[]
}

// 简化的文章列表类型（用于列表页面）
export interface PostListItem {
  id: number
  title: string
  slug: string
  excerpt?: string
  coverImage?: string
  author?: string // 简化的作者名
  authorId?: number
  category?: string
  tags?: string[]
  readTime?: string
  publishDate?: string
  featured: boolean
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: Date
}

// 分类类型
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  color: string
  icon?: string
  postCount: number
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// 标签类型
export interface Tag {
  id: number
  name: string
  slug: string
  description?: string
  postCount: number
  createdAt: Date
  updatedAt: Date
}

// 评论类型
export interface Comment {
  id: number
  postId: number
  parentId?: number
  authorName: string
  authorEmail?: string
  authorWebsite?: string
  authorIp?: string
  userId?: number
  content: string
  status: string
  likeCount: number
  createdAt: Date
  updatedAt: Date

  // 关联数据
  post?: Post
  parent?: Comment
  replies?: Comment[]
  user?: User
}

// 媒体文件类型
export interface MediaFile {
  id: number
  filename: string
  originalName: string
  mimeType: string
  fileSize: number
  filePath: string
  fileUrl: string
  altText?: string
  caption?: string
  uploaderId?: number
  createdAt: Date
}

// 系统设置类型
export interface Setting {
  id: number
  key: string
  value?: string
  type: string
  description?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// API 请求/响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 分页参数
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 文章查询参数
export interface PostQueryParams extends PaginationParams {
  status?: string
  featured?: boolean
  category?: string
  tags?: string[]
  authorId?: number
  search?: string
}

// 认证相关类型
export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email?: string
  password: string
  displayName?: string
}

export interface AuthUser {
  id: number
  username: string
  email?: string | null
  displayName?: string | null
  avatarUrl?: string | null
  isAdmin: boolean
  isActive: boolean
}

export interface AuthResponse {
  user: AuthUser
  token: string
}