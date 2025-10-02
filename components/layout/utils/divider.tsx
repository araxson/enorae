/**
 * Divider Component
 *
 * Visual separator for content sections.
 * Can be horizontal or vertical, with optional label.
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { Spacing } from '../types'

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  spacing?: Spacing
  label?: React.ReactNode
}

const spacingClasses = {
  none: '',
  xs: 'my-2',
  sm: 'my-4',
  md: 'my-6',
  lg: 'my-8',
  xl: 'my-10',
  '2xl': 'my-12',
  '3xl': 'my-16',
} satisfies Record<Spacing, string>

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({
    className,
    orientation = 'horizontal',
    decorative = true,
    spacing = 'md',
    label,
    ...props
  }, ref) => {
    // With label
    if (label && orientation === 'horizontal') {
      return (
        <div
          className={cn(
            'flex items-center',
            spacingClasses[spacing],
            className
          )}
          role={decorative ? 'presentation' : 'separator'}
        >
          <hr className="flex-1 border-t border-border" />
          <span className="px-3 text-sm text-muted-foreground">
            {label}
          </span>
          <hr className="flex-1 border-t border-border" />
        </div>
      )
    }

    // Simple divider
    return (
      <hr
        ref={ref}
        role={decorative ? 'presentation' : 'separator'}
        aria-orientation={orientation}
        className={cn(
          'shrink-0 bg-border border-0',
          orientation === 'horizontal'
            ? ['h-[1px] w-full', spacingClasses[spacing]]
            : 'h-full w-[1px]',
          className
        )}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'