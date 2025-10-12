'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatPercentage } from '../utils/formatters'

type StatBadgeProps = {
  /**
   * The statistic value to display
   */
  value: number
  /**
   * Format of the value
   * - 'percentage': Display as percentage
   * - 'number': Display as plain number
   */
  format?: 'percentage' | 'number'
  /**
   * Show trend indicator (up/down arrow)
   */
  showTrend?: boolean
  /**
   * Size of the badge
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Statistics badge with optional trend indicators
 *
 * @example
 * ```tsx
 * <StatBadge value={12.5} format="percentage" showTrend />
 * <StatBadge value={-5.2} format="percentage" showTrend />
 * <StatBadge value={142} format="number" />
 * ```
 */
export function StatBadge({
  value,
  format = 'percentage',
  showTrend = false,
  size = 'md',
  className,
}: StatBadgeProps) {
  const isPositive = value > 0
  const isNeutral = value === 0

  // Determine badge variant
  const variant = isNeutral ? 'outline' : isPositive ? 'default' : 'destructive'

  // Format display value
  const displayValue =
    format === 'percentage'
      ? formatPercentage(Math.abs(value), { includeSign: !showTrend && !isNeutral })
      : Math.abs(value).toLocaleString('en-US')

  // Size classes
  const sizeClasses = {
    sm: 'text-xs h-5',
    md: 'text-sm h-6',
    lg: 'text-base h-7',
  }

  return (
    <Badge
      variant={variant}
      className={`flex items-center gap-1 ${sizeClasses[size]} ${className || ''}`}
    >
      {showTrend && !isNeutral && (
        <>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" aria-label="Trending up" />
          ) : (
            <TrendingDown className="h-3 w-3" aria-label="Trending down" />
          )}
        </>
      )}
      {showTrend && isNeutral && <Minus className="h-3 w-3" aria-label="No change" />}
      <span>{displayValue}</span>
    </Badge>
  )
}

type ComparisonBadgeProps = {
  /**
   * Current value
   */
  current: number
  /**
   * Previous value
   */
  previous: number
  /**
   * Format of the value
   */
  format?: 'percentage' | 'number'
  /**
   * Show the actual values or just the change
   */
  showValues?: boolean
  /**
   * Size of the badge
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Comparison badge showing change between two values
 *
 * @example
 * ```tsx
 * <ComparisonBadge current={125} previous={100} format="number" />
 * <ComparisonBadge current={85.5} previous={92.3} format="percentage" showValues />
 * ```
 */
export function ComparisonBadge({
  current,
  previous,
  format = 'number',
  showValues = false,
  size = 'md',
  className,
}: ComparisonBadgeProps) {
  const change = previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100
  const isPositive = change > 0
  const isNeutral = change === 0

  // Determine badge variant
  const variant = isNeutral ? 'outline' : isPositive ? 'default' : 'destructive'

  // Format display value
  const displayValue = showValues
    ? format === 'percentage'
      ? `${current.toFixed(1)}% vs ${previous.toFixed(1)}%`
      : `${current.toLocaleString()} vs ${previous.toLocaleString()}`
    : formatPercentage(Math.abs(change), { includeSign: !isNeutral })

  // Size classes
  const sizeClasses = {
    sm: 'text-xs h-5',
    md: 'text-sm h-6',
    lg: 'text-base h-7',
  }

  return (
    <Badge
      variant={variant}
      className={`flex items-center gap-1 ${sizeClasses[size]} ${className || ''}`}
      title={`Change: ${formatPercentage(change, { includeSign: true })}`}
    >
      {!isNeutral && (
        <>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" aria-label="Increased" />
          ) : (
            <TrendingDown className="h-3 w-3" aria-label="Decreased" />
          )}
        </>
      )}
      {isNeutral && <Minus className="h-3 w-3" aria-label="No change" />}
      <span>{displayValue}</span>
    </Badge>
  )
}
