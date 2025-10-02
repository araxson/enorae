/**
 * List Components
 *
 * Semantic list components (ordered and unordered).
 * Use for content that should be displayed in a list format.
 *
 * @example
 * import { Ul, Ol, Li } from '@/components/typography'
 *
 * <Ul>
 *   <Li>First item</Li>
 *   <Li>Second item</Li>
 *   <Li>Third item</Li>
 * </Ul>
 *
 * <Ol>
 *   <Li>Step one</Li>
 *   <Li>Step two</Li>
 *   <Li>Step three</Li>
 * </Ol>
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type UlProps = React.HTMLAttributes<HTMLUListElement>
export type OlProps = React.HTMLAttributes<HTMLOListElement>
export type LiProps = React.HTMLAttributes<HTMLLIElement>

/**
 * Ul - Unordered list
 * Use for lists where order doesn't matter
 */
export const Ul = forwardRef<HTMLUListElement, UlProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('list-disc list-inside', className)}
      {...props}
    />
  )
)
Ul.displayName = 'Ul'

/**
 * Ol - Ordered list
 * Use for sequential or numbered lists
 */
export const Ol = forwardRef<HTMLOListElement, OlProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn('list-decimal list-inside', className)}
      {...props}
    />
  )
)
Ol.displayName = 'Ol'

/**
 * Li - List item
 * Use as children of Ul or Ol
 */
export const Li = forwardRef<HTMLLIElement, LiProps>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(className)}
      {...props}
    />
  )
)
Li.displayName = 'Li'
