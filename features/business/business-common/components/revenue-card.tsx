import { cn } from '@/lib/utils'

'use client'

import type { ReactNode, ComponentType } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency, formatPercentage, calculateGrowthRate } from '@/features/business/business-common/utils/formatters'

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

  return (
    <Card role="article" aria-label={`${title} revenue metric`} className={cardClasses}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {IconComponent && (
          <IconComponent className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
      </CardHeader>
      <CardContent>
        <div className={cn('flex flex-col', compact ? 'gap-2' : 'gap-3')}>
          {/* Primary amount */}
          <div className="flex gap-2">
            <div className={cn('font-semibold', compact ? 'text-2xl' : 'text-3xl font-bold')}>
              {formattedAmount}
            </div>
            {growthRate !== undefined && (
              <Badge
                variant={growthRate >= 0 ? 'default' : 'destructive'}
                className="flex items-center gap-1"
              >
                {growthRate >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPercentage(Math.abs(growthRate), { includeSign: true })}
              </Badge>
            )}
          </div>

          {/* Growth indicator */}
          {growthRate !== undefined && (
            <div className="flex gap-2 items-center">
              {growthRate >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-primary" aria-hidden="true" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-destructive" aria-hidden="true" />
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
          {breakdown && breakdown.length > 0 && (
            <div className="pt-2 border-t">
              <div className="flex flex-col gap-2">
                {breakdown.map((item) => (
                  <div key={item.label} className="flex gap-4 items-center justify-between">
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="text-sm font-medium">
                      {formatCurrency(item.amount, { currency })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtitle */}
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
