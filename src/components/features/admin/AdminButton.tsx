import * as React from 'react'
import { cn } from '@/lib/utils'

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const AdminButton = React.forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) {
      return (
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded-sm"></div>
        </div>
      )
    }

    const baseClasses = 'font-mono transition-all duration-200 rounded-sm border disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary: 'terminal-green bg-background border-border hover:border-primary hover:text-primary',
      secondary: 'terminal-cyan bg-background border-border hover:border-primary hover:text-primary',
      outline: 'terminal-muted bg-background border-border hover:border-primary hover:text-primary',
      ghost: 'terminal-muted bg-transparent border-transparent hover:bg-border/20 hover:text-primary'
    }

    const sizes = {
      sm: 'px-3 py-1 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          'terminal-command',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-pulse">processing...</span>
            <span className="terminal-cursor">_</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {children}
            <span className="terminal-cursor">_</span>
          </span>
        )}
      </button>
    )
  }
)

AdminButton.displayName = 'AdminButton'

export { AdminButton }