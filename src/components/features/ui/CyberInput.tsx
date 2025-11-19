import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string
}

const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, type, prefix, ...props }, ref) => {
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

    if (prefix) {
      return (
        <div className="relative">
          <span className="terminal-cyan font-mono text-sm absolute left-3 top-1/2 -translate-y-1/2 z-10">
            {prefix}
          </span>
          <Input
            type={type}
            className={cn(
              'cyber-input',
              'font-mono text-sm',
              'bg-background border-2 border-border',
              'focus:border-primary focus:outline-none',
              'rounded-sm', /* 像素化圆角 */
              'transition-all var(--duration-normal)',
              'placeholder:text-muted-foreground/60',
              'pl-8 pr-3 py-2',
              'relative',
              'hover:border-primary/50',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      )
    }

    return (
      <Input
        type={type}
        className={cn(
          'cyber-input',
          'font-mono text-sm',
          'bg-background border-2 border-border',
          'focus:border-primary focus:outline-none',
          'rounded-sm', /* 像素化圆角 */
          'transition-all var(--duration-normal)',
          'placeholder:text-muted-foreground/60',
          'px-4 py-2',
          'relative',
          'hover:border-primary/50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

CyberInput.displayName = 'CyberInput'

export { CyberInput }