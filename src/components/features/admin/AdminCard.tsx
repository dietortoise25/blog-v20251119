import * as React from 'react'
import { cn } from '@/lib/utils'

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  command?: string
  children: React.ReactNode
}

const AdminCard = React.forwardRef<HTMLDivElement, AdminCardProps>(
  ({ className, title, command, children, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) {
      return (
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'terminal-window',
          'admin-card',
          'bg-card border border-border rounded-lg p-6',
          'hover:border-primary/50 transition-all duration-300',
          className
        )}
        {...props}
      >
        {(command || title) && (
          <div className="mb-4">
            {command && (
              <div className="terminal-cyan font-mono text-sm mb-2">
                $ {command}
              </div>
            )}
            {title && (
              <div className="terminal-green font-mono text-lg font-bold">
                {title}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    )
  }
)

AdminCard.displayName = 'AdminCard'

export { AdminCard }