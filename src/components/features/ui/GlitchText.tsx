import * as React from 'react'
import { cn } from '@/lib/utils'

interface GlitchTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string
  intensity?: 'low' | 'medium' | 'high'
}

const GlitchText = React.forwardRef<HTMLSpanElement, GlitchTextProps>(
  ({ className, text, intensity = 'medium', ...props }, ref) => {
    const intensityClasses = cn({
      'glitch-text': true,
      'animate-pulse': intensity === 'high',
    })

    return (
      <span
        ref={ref}
        className={cn(intensityClasses, className)}
        data-text={text}
        {...props}
      >
        {text}
      </span>
    )
  }
)

GlitchText.displayName = 'GlitchText'

export { GlitchText }