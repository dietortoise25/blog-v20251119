import { z } from 'zod'

// 用户验证模式
export const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空').max(50, '用户名不能超过50个字符'),
  password: z.string().min(1, '密码不能为空').max(100, '密码不能超过100个字符'),
})

export const registerSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(50, '用户名不能超过50个字符')
    .regex(/^[a-zA-Z0-9_-]+$/, '用户名只能包含字母、数字、下划线和连字符'),
  email: z.string().email('请输入有效的邮箱地址').optional().or(z.literal('')),
  password: z.string()
    .min(6, '密码至少6个字符')
    .max(100, '密码不能超过100个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  displayName: z.string()
    .max(100, '显示名称不能超过100个字符')
    .optional(),
})

export const userUpdateSchema = z.object({
  displayName: z.string().max(100, '显示名称不能超过100个字符').optional(),
  bio: z.string().max(1000, '个人简介不能超过1000个字符').optional(),
  avatarUrl: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  website: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  githubUsername: z.string()
    .max(100, 'GitHub用户名不能超过100个字符')
    .regex(/^[a-zA-Z0-9_-]+$/, 'GitHub用户名只能包含字母、数字、下划线和连字符')
    .optional()
    .or(z.literal('')),
  twitterUsername: z.string()
    .max(100, 'Twitter用户名不能超过100个字符')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Twitter用户名只能包含字母、数字、下划线和连字符')
    .optional()
    .or(z.literal('')),
})

// 文章验证模式
export const postCreateSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .max(255, '标题不能超过255个字符'),
  content: z.string()
    .min(1, '内容不能为空'),
  excerpt: z.string()
    .max(500, '摘要不能超过500个字符')
    .optional(),
  coverImage: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().default(false),
  category: z.string().max(100, '分类不能超过100个字符').optional(),
  tags: z.array(z.string().max(50, '标签不能超过50个字符')).optional(),
  publishDate: z.string().optional(),
  readTime: z.string().optional(),
})

export const postUpdateSchema = postCreateSchema.partial()

export const postQuerySchema = z.object({
  page: z.coerce.number().min(1, '页码必须大于0').default(1),
  limit: z.coerce.number().min(1, '每页数量必须大于0').max(100, '每页数量不能超过100').default(10),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.coerce.boolean().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  authorId: z.coerce.number().min(1, '作者ID必须大于0').optional(),
  search: z.string().max(100, '搜索关键词不能超过100个字符').optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'title', 'viewCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// 分类验证模式
export const categorySchema = z.object({
  name: z.string()
    .min(1, '分类名称不能为空')
    .max(100, '分类名称不能超过100个字符'),
  slug: z.string()
    .min(1, '分类标识不能为空')
    .max(100, '分类标识不能超过100个字符')
    .regex(/^[a-z0-9-]+$/, '分类标识只能包含小写字母、数字和连字符'),
  description: z.string().max(500, '分类描述不能超过500个字符').optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '颜色格式不正确')
    .default('#000000'),
  icon: z.string().max(50, '图标不能超过50个字符').optional(),
  sortOrder: z.coerce.number().min(0, '排序值不能小于0').default(0),
})

// 标签验证模式
export const tagSchema = z.object({
  name: z.string()
    .min(1, '标签名称不能为空')
    .max(50, '标签名称不能超过50个字符'),
  slug: z.string()
    .min(1, '标签标识不能为空')
    .max(50, '标签标识不能超过50个字符')
    .regex(/^[a-z0-9-]+$/, '标签标识只能包含小写字母、数字和连字符'),
  description: z.string().max(500, '标签描述不能超过500个字符').optional(),
})

// 评论验证模式
export const commentCreateSchema = z.object({
  postId: z.coerce.number().min(1, '文章ID必须大于0'),
  parentId: z.coerce.number().min(1, '父评论ID必须大于0').optional(),
  authorName: z.string()
    .min(1, '作者姓名不能为空')
    .max(100, '作者姓名不能超过100个字符'),
  authorEmail: z.string().email('请输入有效的邮箱地址').optional(),
  authorWebsite: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  content: z.string()
    .min(1, '评论内容不能为空')
    .max(1000, '评论内容不能超过1000个字符'),
})

export const commentUpdateSchema = z.object({
  content: z.string()
    .min(1, '评论内容不能为空')
    .max(1000, '评论内容不能超过1000个字符'),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
})

// 媒体文件验证模式
export const mediaFileSchema = z.object({
  filename: z.string().min(1, '文件名不能为空'),
  originalName: z.string().min(1, '原始文件名不能为空'),
  mimeType: z.string().min(1, '文件类型不能为空'),
  fileSize: z.coerce.number().min(1, '文件大小必须大于0'),
  filePath: z.string().min(1, '文件路径不能为空'),
  fileUrl: z.string().url('文件URL格式不正确'),
  altText: z.string().max(255, '替代文本不能超过255个字符').optional(),
  caption: z.string().max(500, '图片说明不能超过500个字符').optional(),
})

// 设置验证模式
export const settingSchema = z.object({
  key: z.string()
    .min(1, '设置键不能为空')
    .max(100, '设置键不能超过100个字符')
    .regex(/^[a-zA-Z0-9_-]+$/, '设置键只能包含字母、数字、下划线和连字符'),
  value: z.string().optional(),
  type: z.enum(['string', 'number', 'boolean', 'json']).default('string'),
  description: z.string().max(500, '设置描述不能超过500个字符').optional(),
  isPublic: z.boolean().default(false),
})

// 类型导出
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type PostCreateInput = z.infer<typeof postCreateSchema>
export type PostUpdateInput = z.infer<typeof postUpdateSchema>
export type PostQueryInput = z.infer<typeof postQuerySchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type TagInput = z.infer<typeof tagSchema>
export type CommentCreateInput = z.infer<typeof commentCreateSchema>
export type CommentUpdateInput = z.infer<typeof commentUpdateSchema>
export type MediaFileInput = z.infer<typeof mediaFileSchema>
export type SettingInput = z.infer<typeof settingSchema>