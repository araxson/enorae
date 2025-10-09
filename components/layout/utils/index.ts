/**
 * Layout Utility Components & Helpers
 * Utilities for layout management and responsive design
 */

// Components
export { Center } from './center'
export type { CenterProps } from './center'

export { VisuallyHidden } from './visually-hidden'
export type { VisuallyHiddenProps } from './visually-hidden'

export { Show, Hide } from './show-hide'
export type { ShowProps, HideProps } from './show-hide'

export { TouchTarget, isTouchTargetCompliant, touchTargetClasses } from './touch-target'
export type { TouchTargetProps } from './touch-target'

// Utilities
export {
  isResponsive,
  responsiveClasses,
} from './responsive'

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
} from './classes'