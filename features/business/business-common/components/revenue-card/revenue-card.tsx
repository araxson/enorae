'use client'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'
import { RevenueCardBreakdown } from '../revenue-card-breakdown'
import { resolveIconComponent, buildCardClasses, calculateGrowth, ICON_COLOR_CLASS } from './utils'
import { GrowthIndicator } from './growth-indicator'
import { AmountDisplay } from './amount-display'
import type { RevenueCardProps } from './types'

/**
 * Revenue card component for displaying revenue metrics with growth indicators
 *
 * @example
 * ```tsx
 * <RevenueCard
 *   title="Monthly Revenue"
 *   amount={45231}
 *   previousAmount={38500}
 *   icon={DollarSign}
 *   subtitle="Last 30 days"
 *   breakdown={[
 *     { label: 'Services', amount: 32000 },
 *     { label: 'Products', amount: 13231 },
 *   ]}
 *   accent="border-l-green-500"
 * />
 * ```
 */
export function RevenueCard({
  title,
  amount,
  previousAmount,
  growth,
  icon,
  subtitle,
  breakdown,
  accent,
  currency = 'USD',
  className,
  compact = false,
}: RevenueCardProps) {
  // Calculate growth rate
  const growthRate = calculateGrowth(amount, previousAmount, growth)

  // Resolve icon component
  const IconComponent = resolveIconComponent(icon)

  // Build card classes
  const cardClasses = buildCardClasses(accent, className)

  return (
    <Item
      role="article"
      aria-label={`${title} revenue metric`}
      variant="outline"
      className={`flex-col gap-4 ${cardClasses}`}
    >
      <ItemHeader>
        <div className="space-y-1">
          <ItemTitle>{title}</ItemTitle>
          {subtitle ? <ItemDescription>{subtitle}</ItemDescription> : null}
        </div>
        {IconComponent ? (
          <ItemActions>
            <IconComponent className={cn('size-4', ICON_COLOR_CLASS)} aria-hidden="true" />
          </ItemActions>
        ) : null}
      </ItemHeader>
      <ItemContent>
        <div className={cn('flex flex-col', compact ? 'gap-2' : 'gap-3')}>
          {/* Primary amount with growth badge */}
          <AmountDisplay
            amount={amount}
            growthRate={growthRate}
            currency={currency}
            compact={compact}
          />

          {/* Growth direction indicator */}
          <GrowthIndicator growthRate={growthRate} />

          {/* Revenue breakdown */}
          <RevenueCardBreakdown breakdown={breakdown ?? []} currency={currency} />

          {/* Subtitle at bottom */}
          {!subtitle ? null : <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
      </ItemContent>
    </Item>
  )
}
