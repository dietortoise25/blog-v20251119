"use client"

import { HeroSection } from '@/components/features/ui'
import { useRouter } from 'next/navigation'

export default function HeroDemoPage() {
  const router = useRouter()

  const handlePrimaryClick = () => {
    router.push('/showcase')
  }

  const handleSecondaryClick = () => {
    console.log('关于开发者命令被点击')
    // 这里可以跳转到关于页面或者显示开发者信息
  }

  return (
    <main className="bg-black">
      <HeroSection
        onPrimaryClick={handlePrimaryClick}
        onSecondaryClick={handleSecondaryClick}
      />

      {/* 添加一些内容来展示滚动效果 */}
      <section className="min-h-screen bg-black border-t border-terminal-border">
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-16 terminal-green">
            {'>>>'} 终端继续输出...
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="terminal-window p-6">
                <div className="terminal-cyan text-lg mb-2">
                  $ blog_{i}.md
                </div>
                <p className="terminal-muted text-sm">
                  这是第 {i} 篇博客文章的预览内容。在终端中浏览和探索技术与创意的交汇点。
                </p>
                <div className="mt-4 terminal-green text-xs">
                  最后更新: 2025-01-{String(i).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}