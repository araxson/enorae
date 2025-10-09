/**
 * Layout Component Library
 *
 * A comprehensive, reusable layout system for Next.js + shadcn/ui projects.
 * All components are fully typed, accessible, and responsive.
 *
 * @version 3.1.0
 * @lastUpdated 2025-10-06
 */

// ============================================================================
// Core Primitives
// ============================================================================

export {
  Box,
  Container,
  Section,
  Spacer,
  type BoxProps,
  type ContainerProps,
  type SectionProps,
  type SpacerProps,
} from './primitives'

// ============================================================================
// Flexbox Components
// ============================================================================

export {
  Flex,
  Stack,
  Group,
  type FlexProps,
  type StackProps,
  type GroupProps,
} from './flex'

// ============================================================================
// Grid Components
// ============================================================================

export {
  Grid,
  type GridProps,
} from './grid'

// ============================================================================
// Utility Components & Helpers
// ============================================================================

export {
  // Components
  Center,
  VisuallyHidden,
  Show,
  Hide,
  TouchTarget,
  isTouchTargetCompliant,
  touchTargetClasses,
  // Types
  type CenterProps,
  type VisuallyHiddenProps,
  type ShowProps,
  type HideProps,
  type TouchTargetProps,
  // Utilities
  isResponsive,
  responsiveClasses,
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
} from './utils'

// ============================================================================
// Navigation Components
// ============================================================================

export {
  DynamicBreadcrumbs,
  UserDropdown,
  MarketingUserNav,
  NavUser,
  NavMain,
  NavSecondary,
  NavFavorites,
  MobileNav,
  getNavIcon,
  type IconName,
} from './navigation'

// ============================================================================
// Headers
// ============================================================================

export {
  PortalHeader,
} from './headers'

// MarketingHeader uses server-only APIs (verifySession)
// Import directly from file:
// import { MarketingHeader } from '@/components/layout/headers/marketing-header'

// ============================================================================
// Sidebars
// ============================================================================

export { PortalSidebar } from './sidebars/portal-sidebar'
export type { PortalSidebarProps } from './sidebars/portal-sidebar'
export type { NavItem, NavSecondaryItem, FavoriteItem } from './sidebars/types'

// ============================================================================
// Footer
// ============================================================================

// Footer is a Server Component (uses client-side newsletter form)
// Import directly from '@/components/layout/footer/footer'

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