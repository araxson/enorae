/**
 * Heading Components
 *
 * Semantic heading components (H1-H6) with consistent styling.
 * Zero opinions - no margins, borders, or spacing. Let layout components handle spacing.
 *
 * @example
 * import { H1, H2, H3 } from '@/components/typography'
 *
 * <H1>Page Title</H1>
 * <H2>Section Heading</H2>
 * <H3>Subsection Heading</H3>
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>

/**
 * H1 - Primary page heading
 * Use once per page for the main title
 */
export const H1 = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        className
      )}
      {...props}
    />
  )
)
H1.displayName = 'H1'

/**
 * H2 - Section heading
 * Use for major sections of content
 */
export const H2 = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'scroll-m-20 text-3xl font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  )
)
H2.displayName = 'H2'

/**
 * H3 - Subsection heading
 * Use for subsections within sections
 */
export const H3 = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  )
)
H3.displayName = 'H3'

/**
 * H4 - Minor heading
 * Use for minor sections or card titles
 */
export const H4 = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  )
)
H4.displayName = 'H4'

/**
 * H5 - Smaller heading
 * Use for component titles or small sections
 */
export const H5 = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(
        'scroll-m-20 text-lg font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  )
)
H5.displayName = 'H5'

/**
 * H6 - Smallest heading
 * Use for the smallest headings or labels
 */
export const H6 = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, ...props }, ref) => (
    <h6
      ref={ref}
      className={cn(
        'scroll-m-20 text-base font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  )
)
H6.displayName = 'H6'
