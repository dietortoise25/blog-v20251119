import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

interface CyberLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {}

const CyberLabel = React.forwardRef<HTMLLabelElement, CyberLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <Label
        ref={ref}
        className={cn(
          'cyber-label',
          'font-mono text-sm font-medium',
          'text-foreground',
          'leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          'electron-text',
          className
        )}
        {...props}
      />
    )
  }
)

CyberLabel.displayName = 'CyberLabel'

export { CyberLabel }