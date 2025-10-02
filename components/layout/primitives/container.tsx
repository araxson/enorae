/**
 * Container Component
 *
 * Provides consistent max-width constraints and horizontal padding.
 * Centers content and controls the maximum width of the layout.
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { ContainerSize } from '../types'
import { containerSizes } from '../utils/classes'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  size?: ContainerSize
  center?: boolean
  noPadding?: boolean
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({
    as: Component = 'div',
    className,
    size = 'lg',
    center = true,
    noPadding = false,
    ...props
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'w-full',
          center && 'mx-auto',
          !noPadding && 'px-4 sm:px-6 lg:px-8',
          containerSizes[size],
          className
        )}
        {...props}
      />
    )
  }
)

Container.displayName = 'Container'