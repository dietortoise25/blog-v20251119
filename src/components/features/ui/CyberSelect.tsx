import * as React from 'react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CyberSelectProps {
  children: React.ReactNode
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

const CyberSelect = React.forwardRef<HTMLButtonElement, CyberSelectProps>(
  ({ children, placeholder = "选择选项", value, onValueChange, className, ...props }, ref) => {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          ref={ref}
          className={cn(
            'cyber-input',
            'font-mono text-sm',
            'bg-background border-2 border-border',
            'focus:border-primary focus:outline-none',
            'rounded-sm', /* 像素化圆角 */
            'transition-all duration-200',
            'px-4 py-2',
            'hover:border-primary/50',
            className
          )}
          {...props}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="cyber-select-content bg-card border-2 border-border rounded-sm">
          {children}
        </SelectContent>
      </Select>
    )
  }
)

const CyberSelectItem = React.forwardRef<HTMLDivElement, { value: string; children: React.ReactNode; className?: string }>(
  ({ value, children, className, ...props }, ref) => {
    return (
      <SelectItem
        ref={ref}
        value={value}
        className={cn(
          'font-mono text-sm',
          'hover:bg-primary/10 focus:bg-primary/10',
          'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </SelectItem>
    )
  }
)

CyberSelect.displayName = 'CyberSelect'
CyberSelectItem.displayName = 'CyberSelectItem'

export { CyberSelect, CyberSelectItem }