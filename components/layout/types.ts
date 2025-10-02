/**
 * Shared types for all layout components
 */

export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>

export type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
export type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse'
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'

export type Display = 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'hidden'
export type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
export type Overflow = 'auto' | 'hidden' | 'visible' | 'scroll'

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12