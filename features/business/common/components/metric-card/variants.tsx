'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatPercentage } from '@/features/business/common/utils'
import { METRIC_VALUE_CLASS } from './utils'
import type { MetricCardProps } from '../../api/types'

/**
 * Default variant content renderer
 */
export function DefaultVariant({ value, subtitle }: Extract<MetricCardProps, { variant?: 'default' }>): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <p className={METRIC_VALUE_CLASS}>{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

/**
 * Progress variant content renderer with progress bar
 */
export function ProgressVariant({
  value,
  progress,
  subtitle,
  progressClass,
}: Extract<MetricCardProps, { variant: 'progress' }>): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <p className={METRIC_VALUE_CLASS}>{value}</p>
      <Progress
        value={progress}
        className={`h-1 ${progressClass ?? ''}`}
        aria-label={`${progress}% progress`}
      />
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

/**
 * Trend variant content renderer with trend badge
 */
export function TrendVariant({
  value,
  trend,
  subtitle,
}: Extract<MetricCardProps, { variant: 'trend' }>): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-end justify-between">
        <p className={METRIC_VALUE_CLASS}>{value}</p>
        <Badge
          variant={trend >= 0 ? 'default' : 'destructive'}
          className="flex items-center gap-1"
        >
          {trend >= 0 ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {formatPercentage(Math.abs(trend))}
        </Badge>
      </div>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

/**
 * Highlight variant content renderer with custom highlight content
 */
export function HighlightVariant({
  value,
  highlight,
  subtitle,
}: Extract<MetricCardProps, { variant: 'highlight' }>): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <p className={METRIC_VALUE_CLASS}>{value}</p>
      {highlight}
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
