import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseClasses = cn(
      'cyber-button relative',
      'font-mono text-sm font-medium tracking-wider',
      'rounded-sm', /* 像素化圆角 */
      {
        'text-xs px-3 py-1': size === 'sm',
        'text-sm px-4 py-2': size === 'default',
        'text-base px-6 py-3': size === 'lg',
        'h-10 w-10 p-0': size === 'icon',
      }
    )

    const variantClasses = cn({
      /* 默认变体 - 像素边框风格 */
      'bg-background text-primary border-2 border-primary hover:bg-primary hover:text-background': variant === 'default',

      /* 次要变体 - 像素灰色 */
      'bg-background text-muted-foreground border-2 border-border hover:text-primary hover:border-primary': variant === 'secondary',

      /* 轮廓变体 - 透明背景 */
      'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-background': variant === 'outline',

      /* 幽灵变体 - 无边框 */
      'bg-transparent text-muted-foreground border-2 border-transparent hover:text-primary hover:bg-accent/10': variant === 'ghost',
    })

    return (
      <Button
        className={cn(baseClasses, variantClasses, className)}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

CyberButton.displayName = 'CyberButton'

export { CyberButton }