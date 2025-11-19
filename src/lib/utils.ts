import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化日期
export function formatDate(date: Date | string): string {
  return dayjs(date).format('YYYY年MM月DD日')
}

// 格式化日期时间
export function formatDateTime(date: Date | string): string {
  return dayjs(date).format('YYYY年MM月DD日 HH:mm:ss')
}

// 格式化相对时间
export function formatRelativeTime(date: Date | string): string {
  return dayjs(date).fromNow()
}

// 生成 slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
}

// 计算阅读时间（分钟）
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200 // 假设每分钟读200个字符
  const wordCount = content.replace(/<[^>]*>/g, '').length // 移除HTML标签
  return Math.ceil(wordCount / wordsPerMinute)
}

// 安全的 JSON 解析
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

// 等待指定时间
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 截取文本
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 成功响应
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  }
}

// 错误响应
export function errorResponse(message: string, error?: string): ApiResponse {
  return {
    success: false,
    message,
    error
  }
}
