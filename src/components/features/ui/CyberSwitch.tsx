import * as React from 'react'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'

interface CyberSwitchProps extends React.ComponentPropsWithoutRef<typeof Switch> {}

const CyberSwitch = React.forwardRef<HTMLButtonElement, CyberSwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <Switch
        ref={ref}
        className={cn(
          'cyber-switch',
          'w-11 h-6',
          'border-2 border-border rounded-full',
          'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
          'data-[state=unchecked]:bg-muted',
          'transition-all duration-300 ease-in-out',
          'relative inline-flex shrink-0 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          className
        )}
        {...props}
      />
    )
  }
)

CyberSwitch.displayName = 'CyberSwitch'

export { CyberSwitch }