import * as React from 'react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'

interface CyberCheckboxProps extends React.ComponentPropsWithoutRef<typeof Checkbox> {}

const CyberCheckbox = React.forwardRef<HTMLButtonElement, CyberCheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <Checkbox
        ref={ref}
        className={cn(
          'cyber-checkbox',
          'w-4 h-4 border-2 border-border rounded-sm',
          'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
          'data-[state=checked]:text-primary-foreground',
          'transition-all duration-200',
          'hover:border-primary/50',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          'relative',
          className
        )}
        {...props}
      />
    )
  }
)

CyberCheckbox.displayName = 'CyberCheckbox'

export { CyberCheckbox }