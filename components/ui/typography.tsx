/**
 * Typography Components
 *
 * Comprehensive typography system for consistent text styling across the application.
 * All components are semantic HTML elements with consistent styling.
 *
 * @example
 * import { H1, H2, H3, P, Lead, Small, Muted } from '@/components/ui/typography'
 *
 * <H1>Page Title</H1>
 * <Lead>Introduction paragraph</Lead>
 * <P>Body content goes here</P>
 * <Small>Helper text or metadata</Small>
 */

// Headings
export {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  type HeadingProps,
} from '@/components/typography/headings'

// Body text
export {
  P,
  Lead,
  Large,
  Small,
  Muted,
  Blockquote,
  type ParagraphProps,
  type SpanProps,
  type BlockquoteProps,
} from '@/components/typography/text'

// Inline elements
export {
  Code,
  InlineCode,
  Kbd,
  Mark,
  Strong,
  Em,
  type CodeProps,
  type KbdProps,
  type MarkProps,
  type StrongProps,
  type EmProps,
} from '@/components/typography/inline'
