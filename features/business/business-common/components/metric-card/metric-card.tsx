'use client'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'
import { resolveIconComponent, buildCardClasses, ICON_COLOR_CLASS } from './utils'
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
 *   accent="border-l-green-500"
 * />
 * ```
 */
export function MetricCard(props: MetricCardProps) {
  const { title, icon, accent, className } = props

  // Resolve icon component
  const IconComponent = resolveIconComponent(icon)

  // Build card classes
  const cardClasses = buildCardClasses(accent, className)

  return (
    <Item
      role="article"
      aria-label={`${title} metric`}
      variant="outline"
      className={`flex-col gap-3 ${cardClasses}`}
    >
      <ItemHeader>
        <ItemTitle>{title}</ItemTitle>
        {IconComponent && (
          <ItemActions>
            <IconComponent className={cn('size-4', ICON_COLOR_CLASS)} aria-hidden="true" />
          </ItemActions>
        )}
      </ItemHeader>
      <ItemContent>
        {props.variant === 'progress' && <ProgressVariant {...props} />}
        {props.variant === 'trend' && <TrendVariant {...props} />}
        {props.variant === 'highlight' && <HighlightVariant {...props} />}
        {(!props.variant || props.variant === 'default') && <DefaultVariant {...props} />}
      </ItemContent>
    </Item>
  )
}
