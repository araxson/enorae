'use client'

import type { ReactNode, ComponentType } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatPercentage } from '@/features/business/business-common/components/value-formatters'

export type MetricCardVariant = 'default' | 'progress' | 'trend' | 'highlight'

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

type DefaultMetricCardProps = BaseMetricCardProps & {
  variant?: 'default'
}

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

type TrendMetricCardProps = BaseMetricCardProps & {
  variant: 'trend'
  /**
   * Trend value (positive or negative percentage)
   */
  trend: number
}

type HighlightMetricCardProps = BaseMetricCardProps & {
  variant: 'highlight'
  /**
   * Additional highlight content (e.g., badges, indicators)
   */
  highlight?: ReactNode
}

export type MetricCardProps =
  | DefaultMetricCardProps
  | ProgressMetricCardProps
  | TrendMetricCardProps
  | HighlightMetricCardProps

/**
 * Unified metric card component for business dashboards
 *
 * Supports multiple variants:
 * - `default`: Simple metric display with icon
 * - `progress`: Metric with progress bar
 * - `trend`: Metric with trend indicator (up/down badge)
 * - `highlight`: Metric with custom highlight content
 *
 * @example
 * ```tsx
 * // Default variant
 * <MetricCard
 *   title="Total Revenue"
 *   value="$45,231"
 *   icon={DollarSign}
 *   subtitle="All-time earnings"
 * />
 *
 * // Progress variant
 * <MetricCard
 *   variant="progress"
 *   title="Confirmed"
 *   value={85}
 *   progress={85}
 *   icon={CheckCircle}
 *   subtitle="85% of total"
 *   accent="border-l-green-500"
 * />
 *
 * // Trend variant
 * <MetricCard
 *   variant="trend"
 *   title="New Customers"
 *   value={127}
 *   trend={12.5}
 *   icon={Users}
 * />
 * ```
 */
export function MetricCard(props: MetricCardProps) {
  const { title, value, icon, subtitle, accent, className } = props

  // Render icon based on type
  const IconComponent =
    icon && typeof icon === 'function' ? icon : icon ? () => icon : null

  // Base card classes
  const cardClasses = [
    'overflow-hidden',
    accent && 'border-l-4',
    accent,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Card role="article" aria-label={`${title} metric`} className={cardClasses}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {IconComponent && (
          <IconComponent className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
      </CardHeader>
      <CardContent>
        {props.variant === 'progress' && (
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">{value}</div>
            <Progress
              value={props.progress}
              className={`h-1 ${props.progressClass ?? ''}`}
              aria-label={`${props.progress}% progress`}
            />
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        {props.variant === 'trend' && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-end justify-between">
              <div className="text-2xl font-bold">{value}</div>
              <Badge
                variant={props.trend >= 0 ? 'default' : 'destructive'}
                className="flex items-center gap-1"
              >
                {props.trend >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPercentage(Math.abs(props.trend))}
              </Badge>
            </div>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        {props.variant === 'highlight' && (
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold">{value}</div>
            {props.highlight}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        {(!props.variant || props.variant === 'default') && (
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
