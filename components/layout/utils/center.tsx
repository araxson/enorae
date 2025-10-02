/**
 * Center Component
 *
 * Centers content both horizontally and vertically.
 * Useful for hero sections, modals, and loading states.
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  axis?: 'both' | 'horizontal' | 'vertical'
  inline?: boolean
  maxWidth?: string
}

export const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({
    as: Component = 'div',
    className,
    axis = 'both',
    inline = false,
    maxWidth,
    style,
    ...props
  }, ref) => {
    return (
      <Component
        ref={ref}
        style={{
          ...(maxWidth && { maxWidth }),
          ...style,
        }}
        className={cn(
          inline ? 'inline-flex' : 'flex',
          axis === 'both' && 'items-center justify-center',
          axis === 'horizontal' && 'justify-center',
          axis === 'vertical' && 'items-center',
          className
        )}
        {...props}
      />
    )
  }
)

Center.displayName = 'Center'