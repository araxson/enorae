import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
}

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as: Component = 'span', className, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('sr-only', className)}
        {...props}
      />
    )
  }
)

VisuallyHidden.displayName = 'VisuallyHidden'