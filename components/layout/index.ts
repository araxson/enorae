/**
 * Layout Component Library
 *
 * A comprehensive, reusable layout system for Next.js + shadcn/ui projects.
 * All components are fully typed, accessible, and responsive.
 */

// ============================================================================
// Core Primitives
// ============================================================================

export { Box } from './primitives/box'
export type { BoxProps } from './primitives/box'

export { Container } from './primitives/container'
export type { ContainerProps } from './primitives/container'

export { Section } from './primitives/section'
export type { SectionProps } from './primitives/section'

export { Spacer } from './primitives/spacer'
export type { SpacerProps } from './primitives/spacer'

// ============================================================================
// Flexbox Components
// ============================================================================

export { Flex } from './flex/flex'
export type { FlexProps } from './flex/flex'

export { Stack } from './flex/stack'
export type { StackProps } from './flex/stack'

export { Group } from './flex/group'
export type { GroupProps } from './flex/group'

// ============================================================================
// Grid Components
// ============================================================================

export { Grid } from './grid/grid'
export type { GridProps } from './grid/grid'

// ============================================================================
// Utility Components
// ============================================================================

export { Center } from './utils/center'
export type { CenterProps } from './utils/center'

export { Divider } from './utils/divider'
export type { DividerProps } from './utils/divider'

export { VisuallyHidden } from './utils/visually-hidden'
export type { VisuallyHiddenProps } from './utils/visually-hidden'

export { AspectRatio } from './utils/aspect-ratio'
export type { AspectRatioProps } from './utils/aspect-ratio'

export { Show, Hide } from './utils/show-hide'
export type { ShowProps, HideProps } from './utils/show-hide'

export { TouchTarget, isTouchTargetCompliant, touchTargetClasses } from './utils/touch-target'
export type { TouchTargetProps } from './utils/touch-target'

// ============================================================================
// Navigation Components
// ============================================================================

export { DynamicBreadcrumbs } from './dynamic-breadcrumbs'
export { NavActions } from './nav-actions'
export { Header } from './header'
export { Footer } from './footer'

// ============================================================================
// Dashboard Sidebar
// ============================================================================

export { PortalSidebar } from './portal-sidebar'
export type { PortalSidebarProps, MenuItem, MenuSection } from './portal-sidebar'

// ============================================================================
// Types & Utils
// ============================================================================

export type {
  Spacing,
  Breakpoint,
  ResponsiveValue,
  AlignItems,
  JustifyContent,
  FlexDirection,
  FlexWrap,
  Display,
  Position,
  Overflow,
  ContainerSize,
  GridCols,
} from './types'

export {
  isResponsive,
  responsiveClasses,
} from './utils/responsive'

// ============================================================================
// Constants
// ============================================================================

export {
  spacing,
  gapClasses,
  paddingClasses,
  marginClasses,
  alignItemsClasses,
  justifyContentClasses,
  flexDirectionClasses,
  flexWrapClasses,
  displayClasses,
  positionClasses,
  overflowClasses,
  containerSizes,
  gridColsClasses,
} from './utils/classes'