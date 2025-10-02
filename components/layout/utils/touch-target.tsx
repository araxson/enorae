import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TouchTargetProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  /**
   * Minimum touch target size (WCAG 2.5.5 Level AAA requires 44x44px)
   * @default '44px'
   */
  size?: '44px' | '48px' | '56px'
  /**
   * Whether to center content within the touch target
   * @default true
   */
  center?: boolean
}

const sizes = {
  '44px': 'min-w-[44px] min-h-[44px]', // WCAG AAA minimum
  '48px': 'min-w-[48px] min-h-[48px]', // Material Design recommended
  '56px': 'min-w-[56px] min-h-[56px]', // Comfortable touch target
} as const

/**
 * TouchTarget Component
 * Ensures interactive elements meet WCAG 2.5.5 touch target size requirements
 * Minimum 44x44px for Level AAA compliance
 *
 * @example
 * <TouchTarget as="button">
 *   <Icon />
 * </TouchTarget>
 *
 * @example
 * <TouchTarget size="48px" as="a" href="/profile">
 *   <Avatar size="sm" />
 * </TouchTarget>
 */
export const TouchTarget = forwardRef<HTMLElement, TouchTargetProps>(
  (
    {
      as: Component = 'div',
      className,
      size = '44px',
      center = true,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'inline-flex',
          sizes[size],
          center && 'items-center justify-center',
          className
        )}
        {...props}
      />
    )
  }
)

TouchTarget.displayName = 'TouchTarget'

/**
 * Utility function to validate if an element meets touch target requirements
 * Use in development to check compliance
 */
export function isTouchTargetCompliant(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  const minSize = 44 // WCAG AAA minimum in pixels
  return rect.width >= minSize && rect.height >= minSize
}

/**
 * Utility class names for quick touch target compliance
 */
export const touchTargetClasses = {
  min: 'min-w-[44px] min-h-[44px]',
  comfortable: 'min-w-[48px] min-h-[48px]',
  large: 'min-w-[56px] min-h-[56px]',
} as const