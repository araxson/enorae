'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { formatPercentage } from '@/features/business/business-common/components/value-formatters'

type StatBadgeProps = {
  value: number
  format?: 'percentage' | 'number'
  showTrend?: boolean
  className?: string
}

const trendVariant = (value: number) => {
  if (value > 0) return 'default'
  if (value < 0) return 'destructive'
  return 'outline'
}

export function StatBadge({
  value,
  format = 'percentage',
  showTrend = false,
  className,
}: StatBadgeProps) {
  const isNeutral = value === 0
  const displayValue =
    format === 'percentage'
      ? formatPercentage(Math.abs(value), { includeSign: !showTrend && !isNeutral })
      : Math.abs(value).toLocaleString('en-US')

  return (
    <Badge variant={trendVariant(value)}>
      <span className={cn('flex items-center gap-1', className)}>
        {showTrend && (
          <>
            {value > 0 && <TrendingUp className="size-3" aria-label="Trending up" />}
            {value < 0 && <TrendingDown className="size-3" aria-label="Trending down" />}
            {isNeutral && <Minus className="size-3" aria-label="No change" />}
          </>
        )}
        <span>{displayValue}</span>
      </span>
    </Badge>
  )
}

type ComparisonBadgeProps = {
  current: number
  previous: number
  format?: 'percentage' | 'number'
  showValues?: boolean
  className?: string
}

export function ComparisonBadge({
  current,
  previous,
  format = 'number',
  showValues = false,
  className,
}: ComparisonBadgeProps) {
  const change = previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100
  const isNeutral = change === 0
  const displayValue = showValues
    ? format === 'percentage'
      ? `${current.toFixed(1)}% vs ${previous.toFixed(1)}%`
      : `${current.toLocaleString()} vs ${previous.toLocaleString()}`
    : formatPercentage(Math.abs(change), { includeSign: !isNeutral })

  return (
    <Badge
      variant={trendVariant(change)}
      title={`Change: ${formatPercentage(change, { includeSign: true })}`}
    >
      <span className={cn('flex items-center gap-1', className)}>
        {!isNeutral && change > 0 && <TrendingUp className="size-3" aria-label="Increased" />}
        {!isNeutral && change < 0 && <TrendingDown className="size-3" aria-label="Decreased" />}
        {isNeutral && <Minus className="size-3" aria-label="No change" />}
        <span>{displayValue}</span>
      </span>
    </Badge>
  )
}
