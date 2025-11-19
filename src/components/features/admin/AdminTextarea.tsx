import * as React from 'react'
import { cn } from '@/lib/utils'

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

const AdminTextarea = React.forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ className, label, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) {
      return (
        <div className="animate-pulse">
          <div className="h-24 bg-muted rounded-sm"></div>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="terminal-green font-mono text-sm">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'cyber-textarea',
            'font-mono text-sm',
            'bg-background border-2 border-border',
            'focus:border-primary focus:outline-none',
            'rounded-sm',
            'transition-all duration-200',
            'placeholder:text-muted-foreground/60',
            'px-4 py-3',
            'hover:border-primary/50',
            'resize-none',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

AdminTextarea.displayName = 'AdminTextarea'

export { AdminTextarea }