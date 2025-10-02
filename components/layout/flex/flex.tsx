/**
 * Flex Component
 *
 * Flexible box layout component with full flexbox controls.
 * Base component for Stack and Group.
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type {
  AlignItems,
  JustifyContent,
  FlexDirection,
  FlexWrap,
  Spacing,
  ResponsiveValue
} from '../types'
import {
  alignItemsClasses,
  justifyContentClasses,
  flexDirectionClasses,
  flexWrapClasses,
  gapClasses
} from '../utils/classes'
import { responsiveClasses } from '../utils/responsive'

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  direction?: ResponsiveValue<FlexDirection>
  align?: ResponsiveValue<AlignItems>
  justify?: ResponsiveValue<JustifyContent>
  wrap?: ResponsiveValue<FlexWrap> | boolean
  gap?: ResponsiveValue<Spacing>
  inline?: boolean
  center?: boolean
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({
    as: Component = 'div',
    className,
    direction = 'row',
    align = 'stretch',
    justify = 'start',
    wrap = 'nowrap',
    gap = 'md',
    inline = false,
    center = false,
    ...props
  }, ref) => {
    // Handle boolean wrap prop for backward compatibility
    const wrapValue: ResponsiveValue<FlexWrap> =
      typeof wrap === 'boolean' ? (wrap ? 'wrap' : 'nowrap') : wrap

    // If center is true, override align and justify
    const actualAlign = center ? 'center' : align
    const actualJustify = center ? 'center' : justify

    return (
      <Component
        ref={ref}
        className={cn(
          inline ? 'inline-flex' : 'flex',
          responsiveClasses(direction, flexDirectionClasses),
          responsiveClasses(actualAlign, alignItemsClasses),
          responsiveClasses(actualJustify, justifyContentClasses),
          responsiveClasses(wrapValue, flexWrapClasses),
          responsiveClasses(gap, gapClasses),
          className
        )}
        {...props}
      />
    )
  }
)

Flex.displayName = 'Flex'