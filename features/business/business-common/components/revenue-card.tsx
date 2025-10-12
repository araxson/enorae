'use client'

import type { ReactNode, ComponentType } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex, Group } from '@/components/layout'
import { H3, Muted, Small } from '@/components/ui/typography'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency, formatPercentage, calculateGrowthRate } from '../utils/formatters'

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
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {IconComponent && (
          <IconComponent className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
      </CardHeader>
      <CardContent>
        <Stack gap={compact ? 'xs' : 'sm'}>
          {/* Primary amount */}
          <Group gap="xs" align="baseline">
            <H3 className={compact ? 'text-2xl' : 'text-3xl font-bold'}>
              {formattedAmount}
            </H3>
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
          </Group>

          {/* Growth indicator */}
          {growthRate !== undefined && (
            <Flex gap="xs" align="center">
              {growthRate >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" aria-hidden="true" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" aria-hidden="true" />
              )}
              <Small
                className={`text-xs ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {growthRate >= 0 ? 'Growth' : 'Decline'} vs. previous period
              </Small>
            </Flex>
          )}

          {/* Breakdown */}
          {breakdown && breakdown.length > 0 && (
            <div className="pt-2 border-t">
              <Stack gap="xs">
                {breakdown.map((item) => (
                  <Flex key={item.label} justify="between" align="center">
                    <Muted className="text-xs">{item.label}</Muted>
                    <Small className="font-medium">
                      {formatCurrency(item.amount, { currency })}
                    </Small>
                  </Flex>
                ))}
              </Stack>
            </div>
          )}

          {/* Subtitle */}
          {subtitle && <Muted className="text-xs">{subtitle}</Muted>}
        </Stack>
      </CardContent>
    </Card>
  )
}
