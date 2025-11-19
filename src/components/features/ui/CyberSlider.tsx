import * as React from 'react'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

interface CyberSliderProps extends React.ComponentPropsWithoutRef<typeof Slider> {}

const CyberSlider = React.forwardRef<HTMLDivElement, CyberSliderProps>(
  ({ className, ...props }, ref) => {
    return (
      <Slider
        ref={ref}
        className={cn(
          'cyber-slider',
          'w-full',
          // 滑轨样式
          '[&_.slider-track]:bg-muted relative h-2 w-full grow overflow-hidden rounded-full border-2 border-border',
          '[&_.slider-range]:absolute h-full bg-primary',
          '[&_.slider-range]:data-[orientation=vertical]:w-full',
          '[&_.slider-range]:data-[orientation=horizontal]:h-full',
          // 滑块样式
          '[&_.slider-thumb]:block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-md transition-all duration-200 hover:scale-110',
          '[&_.slider-thumb]:focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          '[&_.slider-thumb]:data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          // 焦点和激活状态
          '[&_.slider-thumb:hover]:box-shadow-[0_0_8px_oklch(0.72_0.18_145/0.4)]',
          '[&_.slider-thumb]:data-[state=active]:scale-95',
          className
        )}
        {...props}
      />
    )
  }
)

CyberSlider.displayName = 'CyberSlider'

export { CyberSlider }