import * as React from 'react'
import { cn } from '@/lib/utils'

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

const AdminSelect = React.forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ className, label, children, ...props }, ref) => {
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

    return (
      <div className="space-y-2">
        {label && (
          <label className="terminal-green font-mono text-sm">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'cyber-select',
            'font-mono text-sm',
            'bg-background border-2 border-border',
            'focus:border-primary focus:outline-none',
            'rounded-sm',
            'transition-all duration-200',
            'px-3 py-2',
            'hover:border-primary/50',
            'cursor-pointer',
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    )
  }
)

AdminSelect.displayName = 'AdminSelect'

export { AdminSelect }