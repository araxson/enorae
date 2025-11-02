import type { ReactNode, ComponentType } from 'react'

/**
 * Available metric card variants
 */
export type MetricCardVariant = 'default' | 'progress' | 'trend' | 'highlight'

/**
 * Base props shared across all metric card variants
 */
type BaseMetricCardProps = {
  /**
   * Card title
   */
  title: string
  /**
   * Primary value to display
   */
  value: string | number
  /**
   * Optional icon component
   */
  icon?: ReactNode | ComponentType<{ className?: string }>
  /**
   * Optional subtitle or description
   */
  subtitle?: string
  /**
   * Border accent color class (e.g., 'border-l-blue-500')
   */
  accent?: string
  /**
   * Additional CSS classes for the card
   */
  className?: string
}

/**
 * Default variant props
 */
type DefaultMetricCardProps = BaseMetricCardProps & {
  variant?: 'default'
}

/**
 * Progress variant props with progress bar
 */
type ProgressMetricCardProps = BaseMetricCardProps & {
  variant: 'progress'
  /**
   * Progress value (0-100)
   */
  progress: number
  /**
   * Optional custom progress bar classes
   */
  progressClass?: string
}

/**
 * Trend variant props with up/down indicator
 */
type TrendMetricCardProps = BaseMetricCardProps & {
  variant: 'trend'
  /**
   * Trend value (positive or negative percentage)
   */
  trend: number
}

/**
 * Highlight variant props with custom content
 */
type HighlightMetricCardProps = BaseMetricCardProps & {
  variant: 'highlight'
  /**
   * Additional highlight content (e.g., badges, indicators)
   */
  highlight?: ReactNode
}

/**
 * Union type of all metric card props
 */
export type MetricCardProps =
  | DefaultMetricCardProps
  | ProgressMetricCardProps
  | TrendMetricCardProps
  | HighlightMetricCardProps
