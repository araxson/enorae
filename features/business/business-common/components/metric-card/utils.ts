import type { ReactNode, ComponentType } from 'react'

/**
 * Constants for metric card styling
 */
export const METRIC_VALUE_CLASS = 'text-2xl font-semibold leading-none tracking-tight'
export const ICON_COLOR_CLASS = 'text-muted-foreground'

/**
 * Utility to render icon based on type (function component or ReactNode)
 */
export function resolveIconComponent(
  icon?: ReactNode | ComponentType<{ className?: string }>
): ComponentType<{ className?: string }> | null {
  if (!icon) return null
  if (typeof icon === 'function') return icon as ComponentType<{ className?: string }>
  return () => icon as ReactNode
}

/**
 * Build card classes from accent and additional classes
 */
export function buildCardClasses(accent?: string, className?: string): string {
  return [
    'overflow-hidden',
    accent && 'border-l-4',
    accent,
    className,
  ]
    .filter(Boolean)
    .join(' ')
}
