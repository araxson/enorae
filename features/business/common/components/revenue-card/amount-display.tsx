'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage } from '@/features/business/common/utils'
import { PRIMARY_VALUE_CLASS } from './utils'

type AmountDisplayProps = {
  amount: number
  growthRate?: number
  currency: string
  compact: boolean
}

/**
 * Display primary amount with optional growth badge
 */
export function AmountDisplay({ amount, growthRate, currency, compact }: AmountDisplayProps): React.JSX.Element {
  const formattedAmount = formatCurrency(amount, { currency })

  return (
    <ItemGroup>
      <Item>
        <ItemContent className="flex gap-2">
          {compact ? (
            <ItemTitle>{formattedAmount}</ItemTitle>
          ) : (
            <p className={PRIMARY_VALUE_CLASS}>{formattedAmount}</p>
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
  )
}
