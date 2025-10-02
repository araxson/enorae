/**
 * Text Components
 *
 * Body text components with consistent styling.
 * Includes paragraph, lead text, large text, small text, and muted text.
 *
 * @example
 * import { P, Lead, Large, Small, Muted, Blockquote } from '@/components/typography'
 *
 * <Lead>Introduction paragraph with larger text</Lead>
 * <P>Regular body paragraph</P>
 * <Small>Helper text or metadata</Small>
 * <Muted>Subtle, less important text</Muted>
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>
export type SpanProps = React.HTMLAttributes<HTMLSpanElement>
export type BlockquoteProps = React.HTMLAttributes<HTMLQuoteElement>

/**
 * P - Regular paragraph
 * Use for body content and general text blocks
 */
export const P = forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('leading-7', className)}
      {...props}
    />
  )
)
P.displayName = 'P'

/**
 * Lead - Large introductory text
 * Use for opening paragraphs or important callouts
 */
export const Lead = forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xl text-muted-foreground', className)}
      {...props}
    />
  )
)
Lead.displayName = 'Lead'

/**
 * Large - Larger text (inline)
 * Use for emphasized inline text that should be larger
 */
export const Large = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  )
)
Large.displayName = 'Large'

/**
 * Small - Smaller text
 * Use for captions, labels, or secondary information
 */
export const Small = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <small
      ref={ref}
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    />
  )
)
Small.displayName = 'Small'

/**
 * Muted - Muted text
 * Use for less important or supplementary information
 */
export const Muted = forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
)
Muted.displayName = 'Muted'

/**
 * Blockquote - Block quotation
 * Use for quoted content or callouts
 */
export const Blockquote = forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn('border-l-2 pl-6 italic', className)}
      {...props}
    />
  )
)
Blockquote.displayName = 'Blockquote'
