/**
 * Show/Hide Components
 *
 * Conditionally show or hide content at specific breakpoints.
 * Useful for responsive layouts without JavaScript.
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { Breakpoint } from '../types'

export interface ShowProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  /**
   * Show content at this breakpoint and above
   */
  above?: Breakpoint
  /**
   * Show content below this breakpoint
   */
  below?: Breakpoint
  /**
   * Show only at this specific breakpoint
   */
  only?: Breakpoint
}

export interface HideProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  /**
   * Hide content at this breakpoint and above
   */
  above?: Breakpoint
  /**
   * Hide content below this breakpoint
   */
  below?: Breakpoint
  /**
   * Hide only at this specific breakpoint
   */
  only?: Breakpoint
}

// Breakpoint order for logic
const breakpointOrder: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl']

/**
 * Get display classes for Show component
 */
function getShowClasses(above?: Breakpoint, below?: Breakpoint, only?: Breakpoint): string {
  if (only) {
    // Show only at specific breakpoint
    const index = breakpointOrder.indexOf(only)
    if (index === 0) {
      return 'block sm:hidden'
    }
    const nextBp = breakpointOrder[index + 1]
    return `hidden ${only}:block ${nextBp ? `${nextBp}:hidden` : ''}`
  }

  if (above) {
    // Show at breakpoint and above
    return `hidden ${above}:block`
  }

  if (below) {
    // Show below breakpoint
    return `block ${below}:hidden`
  }

  return 'block'
}

/**
 * Get display classes for Hide component
 */
function getHideClasses(above?: Breakpoint, below?: Breakpoint, only?: Breakpoint): string {
  if (only) {
    // Hide only at specific breakpoint
    const index = breakpointOrder.indexOf(only)
    if (index === 0) {
      return 'hidden sm:block'
    }
    const nextBp = breakpointOrder[index + 1]
    return `block ${only}:hidden ${nextBp ? `${nextBp}:block` : ''}`
  }

  if (above) {
    // Hide at breakpoint and above
    return `block ${above}:hidden`
  }

  if (below) {
    // Hide below breakpoint
    return `hidden ${below}:block`
  }

  return 'hidden'
}

/**
 * Show Component
 * Conditionally show content at specific breakpoints
 *
 * @example
 * <Show above="md">
 *   <p>Visible on desktop only</p>
 * </Show>
 *
 * @example
 * <Show below="lg">
 *   <p>Visible on mobile/tablet only</p>
 * </Show>
 *
 * @example
 * <Show only="md">
 *   <p>Visible only on tablet</p>
 * </Show>
 */
export const Show = forwardRef<HTMLElement, ShowProps>(
  (
    {
      as: Component = 'div',
      className,
      above,
      below,
      only,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          getShowClasses(above, below, only),
          className
        )}
        {...props}
      />
    )
  }
)

Show.displayName = 'Show'

/**
 * Hide Component
 * Conditionally hide content at specific breakpoints
 *
 * @example
 * <Hide above="md">
 *   <p>Hidden on desktop</p>
 * </Hide>
 *
 * @example
 * <Hide below="lg">
 *   <p>Hidden on mobile/tablet</p>
 * </Hide>
 *
 * @example
 * <Hide only="md">
 *   <p>Hidden only on tablet</p>
 * </Hide>
 */
export const Hide = forwardRef<HTMLElement, HideProps>(
  (
    {
      as: Component = 'div',
      className,
      above,
      below,
      only,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          getHideClasses(above, below, only),
          className
        )}
        {...props}
      />
    )
  }
)

Hide.displayName = 'Hide'