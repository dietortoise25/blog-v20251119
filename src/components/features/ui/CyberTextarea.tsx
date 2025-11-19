import * as React from 'react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

interface CyberTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const CyberTextarea = React.forwardRef<HTMLTextAreaElement, CyberTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <Textarea
        className={cn(
          'cyber-input',
          'font-mono text-sm',
          'bg-background border-2 border-border',
          'focus:border-primary focus:outline-none',
          'rounded-sm', /* 像素化圆角 */
          'transition-all duration-200',
          'placeholder:text-muted-foreground/60',
          'px-4 py-2',
          'min-h-[80px] resize-y',
          'hover:border-primary/50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

CyberTextarea.displayName = 'CyberTextarea'

export { CyberTextarea }