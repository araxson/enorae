/**
 * Spacer Component
 *
 * Creates consistent space between elements.
 * Useful for creating visual rhythm without margins.
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { Spacing } from '../types'

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: Spacing
  axis?: 'vertical' | 'horizontal' | 'both'
}

const sizes = {
  vertical: {
    none: 'h-0',
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-10',
    '2xl': 'h-12',
    '3xl': 'h-16',
  },
  horizontal: {
    none: 'w-0',
    xs: 'w-2',
    sm: 'w-4',
    md: 'w-6',
    lg: 'w-8',
    xl: 'w-10',
    '2xl': 'w-12',
    '3xl': 'w-16',
  },
  both: {
    none: 'h-0 w-0',
    xs: 'h-2 w-2',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
    '2xl': 'h-12 w-12',
    '3xl': 'h-16 w-16',
  },
} satisfies Record<string, Record<Spacing, string>>

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size = 'md', axis = 'vertical', ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(sizes[axis][size], className)}
        {...props}
      />
    )
  }
)

Spacer.displayName = 'Spacer'