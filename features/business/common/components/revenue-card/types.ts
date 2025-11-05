import type { ComponentType, ReactNode } from 'react'

/**
 * Revenue breakdown item structure
 */
export type RevenueBreakdownItem = {
  label: string
  amount: number
}

/**
 * Revenue card component props
 */
export type RevenueCardProps = {
  /**
   * Card title
   */
  title: string
  /**
   * Revenue amount
   */
  amount: number
  /**
   * Optional previous period amount (for growth calculation)
   */
  previousAmount?: number
  /**
   * Optional manual growth rate override
   */
  growth?: number
  /**
   * Optional icon component
   */
  icon?: ReactNode | ComponentType<{ className?: string }>
  /**
   * Optional subtitle or time period
   */
  subtitle?: string
  /**
   * Optional breakdown of revenue sources
   */
  breakdown?: RevenueBreakdownItem[]
  /**
   * Border accent color class
   */
  accent?: string
  /**
   * Currency code (default: USD)
   */
  currency?: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Show compact view (smaller text)
   */
  compact?: boolean
}
