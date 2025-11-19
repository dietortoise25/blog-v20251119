import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glitch?: boolean
}

const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ className, glitch = false, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'bg-card text-card-foreground',
          'border border-primary/15 backdrop-blur-sm',
          'relative overflow-hidden',
          'transition-all duration-200 ease-in-out',
          'hover:shadow-[0_0_8px_rgb(126,196,124,0.2)] hover:border-primary/25',
          {
            'animate-pulse': glitch,
          },
          className
        )}
        {...props}
      >
        <div className="noise-overlay" />
        {glitch && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="data-stream" />
          </div>
        )}
        {children}
      </Card>
    )
  }
)

const CyberCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardHeader ref={ref} className={cn('pb-4 border-b border-primary/10', className)} {...props} />
  )
)

const CyberCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <CardTitle ref={ref} className={cn('text-2xl font-bold text-primary matrix-text', className)} {...props} />
  )
)

const CyberCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <CardDescription ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
  )
)

const CyberCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardContent ref={ref} className={cn('p-6 pt-4', className)} {...props} />
  )
)

const CyberCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardFooter ref={ref} className={cn('pt-4 border-t border-primary/10', className)} {...props} />
  )
)

CyberCard.displayName = 'CyberCard'
CyberCardHeader.displayName = 'CyberCardHeader'
CyberCardTitle.displayName = 'CyberCardTitle'
CyberCardDescription.displayName = 'CyberCardDescription'
CyberCardContent.displayName = 'CyberCardContent'
CyberCardFooter.displayName = 'CyberCardFooter'

export { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardDescription, CyberCardContent, CyberCardFooter }