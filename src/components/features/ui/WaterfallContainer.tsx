import * as React from 'react'
import { cn } from '@/lib/utils'

interface WaterfallContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  gap?: string
}

const WaterfallContainer = React.forwardRef<HTMLDivElement, WaterfallContainerProps>(
  ({ className, children, gap = '1.5rem', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'waterfall-container',
          'py-4',
          gap && `[column-gap:${gap}]`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

const WaterfallItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'break-inside-avoid mb-6',
          'bg-card p-6 rounded-lg border border-primary/10',
          'hover:border-primary/20 hover:bg-accent/5 transition-all duration-200',
          className
        )}
        {...props}
      >
        <div className="noise-overlay" />
      </div>
    )
  }
)

WaterfallContainer.displayName = 'WaterfallContainer'
WaterfallItem.displayName = 'WaterfallItem'

export { WaterfallContainer, WaterfallItem }