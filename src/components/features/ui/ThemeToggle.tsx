'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, ...props }, ref) => {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // 避免hydration mismatch
    React.useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) {
      return (
        <button
          ref={ref}
          className={cn(
            'cyber-button',
            'h-10 w-10 rounded-md',
            'flex items-center justify-center',
            className
          )}
          disabled
          {...props}
        >
          <Sun className="h-4 w-4" />
        </button>
      )
    }

    const isDark = resolvedTheme === 'dark'

    return (
      <button
        ref={ref}
        className={cn(
          'cyber-button',
          'h-10 w-10 rounded-md',
          'flex items-center justify-center',
          'hover-glow transition-all duration-300',
          'relative overflow-hidden',
          className
        )}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
        {...props}
      >
        {/* 背景故障效果 */}
        <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300">
          <div className="absolute inset-0 bg-primary animate-pulse" />
        </div>

        {/* 图标切换动画 */}
        <div className="relative h-4 w-4">
          <Sun
            className={cn(
              'absolute inset-0 h-4 w-4 transition-all duration-300',
              isDark
                ? 'rotate-90 scale-0 opacity-0'
                : 'rotate-0 scale-100 opacity-100'
            )}
          />
          <Moon
            className={cn(
              'absolute inset-0 h-4 w-4 transition-all duration-300',
              isDark
                ? 'rotate-0 scale-100 opacity-100'
                : '-rotate-90 scale-0 opacity-0'
            )}
          />
        </div>

        {/* 悬停效果指示器 */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </button>
    )
  }
)

ThemeToggle.displayName = 'ThemeToggle'

export { ThemeToggle }