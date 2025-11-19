"use client"

import dynamic from 'next/dynamic'
import { CyberSonner } from './CyberSonner'

// 动态导入 CyberSonner 组件，禁用 SSR
const DynamicCyberSonner = dynamic(
  () => Promise.resolve(CyberSonner),
  {
    ssr: false,
    loading: () => null // 加载时不显示任何内容
  }
)

export { DynamicCyberSonner }