'use client'

import type { ComponentType, ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { calculateGrowthRate, formatCurrency, formatPercentage } from '@/features/business/business-common/components/value-formatters'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'
import { RevenueCardBreakdown } from './revenue-card-breakdown'

type RevenueCardProps = {
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
  breakdown?: Array<{
    label: string
    amount: number
  }>
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
  // Calculate growth if previous amount provided
  const growthRate =
    growth !== undefined
      ? growth
      : previousAmount !== undefined
        ? calculateGrowthRate(amount, previousAmount)
        : undefined

  // Render icon based on type
  const IconComponent =
    icon && typeof icon === 'function' ? icon : icon ? () => icon : null

  // Card classes
  const cardClasses = [
    'overflow-hidden',
    accent && 'border-l-4',
    accent,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Format amount
  const formattedAmount = formatCurrency(amount, { currency })

  const primaryValueClass = 'text-2xl font-semibold leading-none tracking-tight'
  const iconColorClass = 'text-muted-foreground'

  return (
    <Item role="article" aria-label={`${title} revenue metric`} variant="outline" className={`flex-col gap-4 ${cardClasses}`}>
      <ItemHeader>
        <div className="space-y-1">
          <ItemTitle>{title}</ItemTitle>
          {subtitle ? <ItemDescription>{subtitle}</ItemDescription> : null}
        </div>
        {IconComponent ? (
          <ItemActions>
            <IconComponent className={cn('size-4', iconColorClass)} aria-hidden="true" />
          </ItemActions>
        ) : null}
      </ItemHeader>
      <ItemContent>
        <div className={cn('flex flex-col', compact ? 'gap-2' : 'gap-3')}>
          {/* Primary amount */}
          <ItemGroup>
            <Item>
              <ItemContent className="flex gap-2">
                {compact ? (
                  <ItemTitle>{formattedAmount}</ItemTitle>
                ) : (
                  <p className={primaryValueClass}>{formattedAmount}</p>
                )}
                {growthRate !== undefined && (
                  <Badge
                    variant={growthRate >= 0 ? 'default' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    {growthRate >= 0 ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {formatPercentage(Math.abs(growthRate), { includeSign: true })}
                  </Badge>
                )}
              </ItemContent>
            </Item>
          </ItemGroup>

          {/* Growth indicator */}
          {growthRate !== undefined && (
            <div className="flex gap-2 items-center">
              {growthRate >= 0 ? (
                <ArrowUpRight className="size-3 text-primary" aria-hidden="true" />
              ) : (
                <ArrowDownRight className="size-3 text-destructive" aria-hidden="true" />
              )}
              <div
                className={cn(
                  'text-xs font-medium',
                  growthRate >= 0 ? 'text-primary' : 'text-destructive'
                )}
              >
                {growthRate >= 0 ? 'Growth' : 'Decline'} vs. previous period
              </div>
            </div>
          )}

          {/* Breakdown */}
          <RevenueCardBreakdown breakdown={breakdown ?? []} currency={currency} />

          {/* Subtitle */}
          {!subtitle ? null : <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
      </ItemContent>
    </Item>
  )
}
