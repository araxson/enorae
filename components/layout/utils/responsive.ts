/**
 * Responsive utilities for handling breakpoint-specific values
 */

import type { Breakpoint, ResponsiveValue } from '../types'

/**
 * Check if a value is a responsive object
 */
export function isResponsive<T>(value: ResponsiveValue<T>): value is Partial<Record<Breakpoint, T>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Convert responsive value to Tailwind classes
 */
export function responsiveClasses<T extends string | number>(
  value: ResponsiveValue<T> | undefined,
  classMap: Record<string, string> | Record<number, string>
): string | undefined {
  if (!value) return undefined

  // Helper to safely get class from map
  const getClass = (key: T): string | undefined => {
    if (typeof key === 'string') {
      return (classMap as Record<string, string>)[key]
    }
    return (classMap as Record<number, string>)[key as number]
  }

  // Single value
  if (!isResponsive(value)) {
    return getClass(value)
  }

  // Responsive object
  const classes: string[] = []
  const breakpoints: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl']

  breakpoints.forEach((bp) => {
    const val = value[bp]
    if (val !== undefined) {
      const cls = getClass(val)
      if (cls) {
        if (bp === 'base') {
          classes.push(cls)
        } else {
          // Add breakpoint prefix
          classes.push(`${bp}:${cls}`)
        }
      }
    }
  })

  return classes.length > 0 ? classes.join(' ') : undefined
}