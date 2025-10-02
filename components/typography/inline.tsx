/**
 * Inline Text Components
 *
 * Inline text elements for code, keyboard shortcuts, marks, and emphasis.
 * Use within text blocks for semantic markup and consistent styling.
 *
 * @example
 * import { Code, InlineCode, Kbd, Mark, Strong, Em } from '@/components/typography'
 *
 * <P>
 *   Press <Kbd>Cmd</Kbd> + <Kbd>K</Kbd> to open the command palette.
 *   Use <InlineCode>const</InlineCode> for constants.
 *   <Strong>Important:</Strong> <Em>Read this carefully</Em>.
 * </P>
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type CodeProps = React.HTMLAttributes<HTMLElement>
export type KbdProps = React.HTMLAttributes<HTMLElement>
export type MarkProps = React.HTMLAttributes<HTMLElement>
export type StrongProps = React.HTMLAttributes<HTMLElement>
export type EmProps = React.HTMLAttributes<HTMLElement>

/**
 * Code - Inline code
 * Use for inline code snippets or technical terms
 */
export const Code = forwardRef<HTMLElement, CodeProps>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className
      )}
      {...props}
    />
  )
)
Code.displayName = 'Code'

/**
 * InlineCode - Alias for Code
 * Same as Code, provided for clarity when used inline
 */
export const InlineCode = Code
InlineCode.displayName = 'InlineCode'

/**
 * Kbd - Keyboard key
 * Use for keyboard shortcuts and key combinations
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100',
        className
      )}
      {...props}
    />
  )
)
Kbd.displayName = 'Kbd'

/**
 * Mark - Highlighted text
 * Use to highlight or mark important text
 */
export const Mark = forwardRef<HTMLElement, MarkProps>(
  ({ className, ...props }, ref) => (
    <mark
      ref={ref}
      className={cn('bg-yellow-200 dark:bg-yellow-900/50 px-1', className)}
      {...props}
    />
  )
)
Mark.displayName = 'Mark'

/**
 * Strong - Strong emphasis
 * Use for strong importance or emphasis
 */
export const Strong = forwardRef<HTMLElement, StrongProps>(
  ({ className, ...props }, ref) => (
    <strong
      ref={ref}
      className={cn('font-bold', className)}
      {...props}
    />
  )
)
Strong.displayName = 'Strong'

/**
 * Em - Emphasis
 * Use for emphasis or stress
 */
export const Em = forwardRef<HTMLElement, EmProps>(
  ({ className, ...props }, ref) => (
    <em
      ref={ref}
      className={cn('italic', className)}
      {...props}
    />
  )
)
Em.displayName = 'Em'
