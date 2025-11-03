'use client'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { PricingRule } from '@/features/business/pricing/api/types'
import { formatCurrency } from './pricing-utils'
import { DollarSign, TrendingUp, Zap } from 'lucide-react'

interface PricingSummaryCardsProps {
  rules: PricingRule[]
  totalPotentialRevenue: number
  servicesCount: number
}

export function PricingSummaryCards({
  rules,
  totalPotentialRevenue,
  servicesCount,
}: PricingSummaryCardsProps) {
  const valueClass = 'text-2xl font-semibold leading-none tracking-tight'

  return (
    <ItemGroup className="grid gap-4 md:grid-cols-3">
      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Active Rules</ItemTitle>
          <ItemActions>
            <Zap className="size-4 text-accent" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className={valueClass}>{rules.length}</p>
          <ItemDescription>
            {rules.filter(r => r.adjustment_type === 'surge').length} surges,{' '}
            {rules.filter(r => r.adjustment_type === 'discount').length} discounts
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Revenue Potential</ItemTitle>
          <ItemActions>
            <TrendingUp className="size-4 text-primary" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className={valueClass}>{formatCurrency(totalPotentialRevenue)}</p>
          <ItemDescription>Estimated monthly increase</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Services Optimized</ItemTitle>
          <ItemActions>
            <DollarSign className="size-4 text-muted-foreground" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className={valueClass}>{servicesCount}</p>
          <ItemDescription>Dynamic pricing enabled</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
