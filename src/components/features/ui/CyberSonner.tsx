import * as React from 'react'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import type { ToasterProps } from 'sonner'

interface CyberSonnerProps extends ToasterProps {}

const CyberSonner = ({ className, ...props }: CyberSonnerProps) => {
    return (
      <Toaster
        className={cn(
          'cyber-sonner',
          // 基础样式
          'font-mono text-sm',
          // 边框和背景
          'border-2 border-border cyber-border',
          // 电子屏效果
          'electron-text',
          // 动画效果
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[swipe=end]:animate-out data-[swipe=cancel]:animate-in',
          'data-[swipe=move]:translate-x-[var(--swipe-move-x)] data-[swipe=move]:translate-none',
          'data-[swipe=end]:translate-x-[var(--swipe-end-x)]',
          // 过渡效果
          'data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-bottom-auto',
          'data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full',
          className
        )}
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '2px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            imageRendering: 'pixelated',
          },
          className: 'cyber-border electron-text',
          ...props.toastOptions,
        }}
        position="bottom-right"
        expand={false}
        richColors={true}
        {...props}
      />
    )
}

CyberSonner.displayName = 'CyberSonner'

export { CyberSonner }