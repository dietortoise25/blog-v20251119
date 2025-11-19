"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { BlogLayout } from '@/components/features/layout'
import { HeroSection } from '@/components/features/ui'

export default function HomePage() {
  const router = useRouter()

  const handlePrimaryClick = () => {
    router.push('/blog')
  }

  const handleSecondaryClick = () => {
    router.push('/about')
  }

  return (
    <BlogLayout showBreadcrumb={false}>
      {/* Hero Section */}
      <HeroSection
        onPrimaryClick={handlePrimaryClick}
        onSecondaryClick={handleSecondaryClick}
      />

      {/* Recent Posts Preview */}
      <section className="mt-20">
        <div className="terminal-window">
          <div className="terminal-cyan text-lg mb-6">
            $ ls recent_posts/
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-border rounded p-4 hover:border-primary transition-colors cursor-pointer"
                onClick={() => router.push(`/blog/nextjs-typescript-best-practices`)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-terminal-green rounded-full"></div>
                  <span className="terminal-green text-sm">post_{i}.md</span>
                </div>

                <h3 className="terminal-cyan text-base mb-2">
                  Blog Post Title {i}
                </h3>

                <p className="terminal-muted text-sm mb-4 line-clamp-3">
                  这是第 {i} 篇博客文章的摘要预览内容，展示技术与创意的交汇点...
                </p>

                <div className="flex items-center justify-between">
                  <span className="terminal-yellow text-xs">
                    2025-01-{String(i).padStart(2, '0')}
                  </span>
                  <span
                    className="terminal-cyan text-xs hover:text-primary cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push('/blog/nextjs-typescript-best-practices')
                    }}
                  >
                    $ read_more
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/blog')}
              className="terminal-command px-6 py-2 border border-border rounded hover:border-primary transition-colors terminal-green"
            >
              $ view_all_posts
            </button>
          </div>
        </div>
      </section>

      {/* Terminal Stats */}
      <section className="mt-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="terminal-window">
            <div className="terminal-cyan text-sm mb-2">
              $ cat posts_count.txt
            </div>
            <div className="terminal-green text-2xl font-bold">
              42
            </div>
            <div className="terminal-muted text-xs">
              Total Posts
            </div>
          </div>

          <div className="terminal-window">
            <div className="terminal-cyan text-sm mb-2">
              $ du -sh categories/
            </div>
            <div className="terminal-green text-2xl font-bold">
              8
            </div>
            <div className="terminal-muted text-xs">
              Categories
            </div>
          </div>

          <div className="terminal-window">
            <div className="terminal-cyan text-sm mb-2">
              $ cat last_update.log
            </div>
            <div className="terminal-green text-2xl font-bold">
              Today
            </div>
            <div className="terminal-muted text-xs">
              Last Updated
            </div>
          </div>
        </div>
      </section>
    </BlogLayout>
  )
}
