/**
 * Centralized class mappings for consistent styling
 */

import type {
  Spacing,
  AlignItems,
  JustifyContent,
  FlexDirection,
  FlexWrap,
  Display,
  Position,
  Overflow,
  ContainerSize,
  GridCols
} from '../types'

// Spacing scales - single source of truth
export const spacing = {
  none: '0',
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '2.5rem',   // 40px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
} satisfies Record<Spacing, string>

// Gap classes
export const gapClasses = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-10',
  '2xl': 'gap-12',
  '3xl': 'gap-16',
} satisfies Record<Spacing, string>

// Padding classes
export const paddingClasses = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
  '2xl': 'p-12',
  '3xl': 'p-16',
} satisfies Record<Spacing, string>

// Margin classes
export const marginClasses = {
  none: 'm-0',
  xs: 'm-2',
  sm: 'm-4',
  md: 'm-6',
  lg: 'm-8',
  xl: 'm-10',
  '2xl': 'm-12',
  '3xl': 'm-16',
} satisfies Record<Spacing, string>

// Flexbox alignment
export const alignItemsClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} satisfies Record<AlignItems, string>

export const justifyContentClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} satisfies Record<JustifyContent, string>

export const flexDirectionClasses = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  col: 'flex-col',
  'col-reverse': 'flex-col-reverse',
} satisfies Record<FlexDirection, string>

export const flexWrapClasses = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
} satisfies Record<FlexWrap, string>

// Display classes
export const displayClasses = {
  block: 'block',
  'inline-block': 'inline-block',
  inline: 'inline',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  grid: 'grid',
  hidden: 'hidden',
} satisfies Record<Display, string>

// Position classes
export const positionClasses = {
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',
} satisfies Record<Position, string>

// Overflow classes
export const overflowClasses = {
  auto: 'overflow-auto',
  hidden: 'overflow-hidden',
  visible: 'overflow-visible',
  scroll: 'overflow-scroll',
} satisfies Record<Overflow, string>

// Container sizes
export const containerSizes = {
  xs: 'max-w-md',      // 448px
  sm: 'max-w-2xl',     // 672px
  md: 'max-w-4xl',     // 896px
  lg: 'max-w-6xl',     // 1152px
  xl: 'max-w-7xl',     // 1280px
  '2xl': 'max-w-screen-2xl', // 1536px
  full: 'max-w-full',
} satisfies Record<ContainerSize, string>

// Grid columns
export const gridColsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
} satisfies Record<GridCols, string>