"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  className?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

export function HeroSection({
  className,
  onPrimaryClick,
  onSecondaryClick,
  ...props
}: HeroSectionProps) {
  const [mounted, setMounted] = React.useState(false)
  const [systemStatus, setSystemStatus] = React.useState<'initializing' | 'complete'>('initializing')
  const [currentProgress, setCurrentProgress] = React.useState(0)
  const [showContent, setShowContent] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)

    // 模拟系统初始化过程
    const progressInterval = setInterval(() => {
      setCurrentProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setSystemStatus('complete')
            setTimeout(() => setShowContent(true), 500)
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(progressInterval)
  }, [])

  if (!mounted) {
    return (
      <div className={cn("relative min-h-screen flex items-center justify-center bg-background", className)}>
        <div className="terminal-green">
          $ Loading terminal...
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative min-h-screen flex items-center justify-center", className)} {...props}>
      {/* 终端窗口容器 */}
      <div className="terminal-window w-full max-w-4xl mx-auto px-4">

        {/* 顶部状态栏 */}
        <div className="terminal-header flex items-center justify-between border-b border-terminal-border pb-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-terminal-green"></div>
          </div>
          <div className="terminal-green text-sm">
            cyber-blog@terminal
          </div>
          <div className="text-terminal-cyan text-sm">
            alan@developer
          </div>
        </div>

        {/* 主要终端内容 */}
        <div className="terminal-content space-y-4 font-mono text-sm">

          {/* 欢迎消息 */}
          <div className="terminal-cyan">
            $ WELCOME_TO_CYBER_BLOG
          </div>

          {/* 系统状态 */}
          <div className="text-terminal-yellow">
            System Status: [{systemStatus === 'complete' ? 'ACTIVE' : 'INITIALIZING'}]
          </div>

          <div className="text-terminal-yellow">
            Connection: [SECURE]
          </div>

          {/* 系统初始化 */}
          <div className="terminal-cyan">
            $ 初始化博客系统...
          </div>

          <div className="flex items-center gap-2">
            <div className="text-terminal-green">[</div>
            <div className="flex-1 h-4 bg-terminal-border/30 rounded overflow-hidden">
              <div
                className="h-full bg-terminal-green transition-all duration-300 ease-out"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <div className="text-terminal-green">]</div>
            <span className="text-terminal-green min-w-12 text-right">
              {currentProgress}%
            </span>
          </div>

          {/* 完成状态消息 */}
          {systemStatus === 'complete' && (
            <>
              <div className="text-terminal-green">
                ✓ 系统启动完成
              </div>
              <div className="text-terminal-green">
                ✓ 数据库连接成功
              </div>
              <div className="text-terminal-green">
                ✓ 主题加载完成
              </div>
            </>
          )}

          {/* 主介绍内容 */}
          {showContent && (
            <>
              <div className="terminal-cyan mt-6">
                $ 这是一个专注于编程与创意思考的数字空间
              </div>
              <div className="text-terminal-muted ml-4">
                在这里探索代码、艺术与未来的交汇点
              </div>

              {/* 可用命令 */}
              <div className="terminal-cyan mt-6">
                $ 可用命令:
              </div>

              <div className="space-y-2 ml-4">
                <div className="terminal-command hover:bg-terminal-border/20 p-2 rounded cursor-pointer transition-colors" onClick={onPrimaryClick}>
                  <span className="text-terminal-yellow">[01]</span>
                  <span className="text-terminal-green ml-2">read_blog</span>
                  <span className="text-terminal-muted ml-2">- 进入博客文章</span>
                </div>

                <div className="terminal-command hover:bg-terminal-border/20 p-2 rounded cursor-pointer transition-colors" onClick={onSecondaryClick}>
                  <span className="text-terminal-yellow">[02]</span>
                  <span className="text-terminal-green ml-2">about_dev</span>
                  <span className="text-terminal-muted ml-2">- 了解开发者</span>
                </div>
              </div>

              {/* 输入提示符 */}
              <div className="terminal-cyan mt-8 flex items-center">
                <span>$ 请输入指令: </span>
                <span className="terminal-cursor ml-1">_</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}