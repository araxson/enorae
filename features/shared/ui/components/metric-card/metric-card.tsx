'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { resolveIconComponent, getAccentStripeClass, ICON_COLOR_CLASS } from './utils'
import { DefaultVariant, ProgressVariant, TrendVariant, HighlightVariant } from './variants'
import type { MetricCardProps } from './types'

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
 *   accent="success"
 * />
 * ```
 */
export function MetricCard(props: MetricCardProps) {
  const { title, icon, accent, className } = props

  // Resolve icon component
  const IconComponent = resolveIconComponent(icon)

  const accentStripeClass = getAccentStripeClass(accent)

  return (
    <Card
      role="article"
      aria-label={`${title} metric`}
      className={cn('relative space-y-4 overflow-hidden', className)}
    >
      {accentStripeClass ? (
        <span
          aria-hidden="true"
          className={cn('absolute inset-y-0 left-0 w-1', accentStripeClass)}
        />
      ) : null}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
        <CardTitle>{title}</CardTitle>
        {IconComponent ? (
          <IconComponent className={cn('size-4', ICON_COLOR_CLASS)} aria-hidden="true" />
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {props.variant === 'progress' && <ProgressVariant {...props} />}
        {props.variant === 'trend' && <TrendVariant {...props} />}
        {props.variant === 'highlight' && <HighlightVariant {...props} />}
        {(!props.variant || props.variant === 'default') && <DefaultVariant {...props} />}
      </CardContent>
    </Card>
  )
}
