import * as React from 'react'
import { cn } from '@/lib/utils'

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string
  label?: string
}

const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ className, type, prefix, label, ...props }, ref) => {
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

    const inputElement = (
      <input
        type={type}
        className={cn(
          'cyber-input',
          'font-mono text-sm',
          'bg-background border-2 border-border',
          'focus:border-primary focus:outline-none',
          'rounded-sm', /* 像素化圆角 */
          'transition-all duration-200',
          'placeholder:text-muted-foreground/60',
          prefix ? 'pl-8 pr-3 py-2' : 'px-4 py-2',
          'hover:border-primary/50',
          className
        )}
        ref={ref}
        {...props}
      />
    )

    if (prefix) {
      return (
        <div className="relative">
          <span className="terminal-cyan font-mono text-sm absolute left-3 top-1/2 -translate-y-1/2 z-10">
            {prefix}
          </span>
          {inputElement}
        </div>
      )
    }

    return inputElement
  }
)

AdminInput.displayName = 'AdminInput'

export { AdminInput }