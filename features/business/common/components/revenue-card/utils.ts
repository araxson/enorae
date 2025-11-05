import type { ComponentType, ReactNode } from 'react'
import { calculateGrowthRate } from '@/features/business/common/utils'

/**
 * Style constants for revenue card
 */
export const PRIMARY_VALUE_CLASS = 'text-2xl font-semibold leading-none tracking-tight'
export const ICON_COLOR_CLASS = 'text-muted-foreground'

/**
 * Resolve icon component from ReactNode or function
 */
export function resolveIconComponent(
  icon?: ReactNode | ComponentType<{ className?: string }>
): ComponentType<{ className?: string }> | null {
  if (!icon) return null
  if (typeof icon === 'function') return icon as ComponentType<{ className?: string }>
  return () => icon as ReactNode
}

/**
 * Build card CSS classes from accent and custom classes
 */
export function buildCardClasses(accent?: string, className?: string): string {
  return ['overflow-hidden', accent && 'border-l-4', accent, className]
    .filter(Boolean)
    .join(' ')
}

/**
 * Calculate growth rate from current and previous amounts
 */
export function calculateGrowth(
  amount: number,
  previousAmount?: number,
  growth?: number
): number | undefined {
  if (growth !== undefined) return growth
  if (previousAmount !== undefined) {
    return calculateGrowthRate(amount, previousAmount)
  }
  return undefined
}
