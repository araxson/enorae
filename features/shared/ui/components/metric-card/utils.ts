import type { ReactNode, ComponentType } from 'react'
import type { MetricCardAccent } from './types'

/**
 * Constants for metric card styling
 */
export const METRIC_VALUE_CLASS = 'text-2xl font-semibold leading-none tracking-tight'
export const ICON_COLOR_CLASS = 'text-muted-foreground'

const ACCENT_STRIPE_MAP: Record<MetricCardAccent, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info: 'bg-sky-500',
  destructive: 'bg-destructive',
}

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

export function getAccentStripeClass(accent?: MetricCardAccent): string | null {
  if (!accent) return null
  return ACCENT_STRIPE_MAP[accent] ?? null
}
