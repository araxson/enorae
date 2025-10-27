'use client'

import { TrendingUp, DollarSign, Zap } from 'lucide-react'
import type { PricingRule } from '@/features/business/pricing/types'
import { formatCurrency } from './pricing-utils'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

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
  return (
    <ItemGroup className="grid gap-4 md:grid-cols-3">
      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader className="items-center justify-between">
          <ItemTitle>Active Rules</ItemTitle>
          <ItemActions className="flex-none">
            <Zap className="h-4 w-4 text-accent" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <div className="text-2xl font-bold">{rules.length}</div>
          <ItemDescription>
            {rules.filter(r => r.adjustment_type === 'surge').length} surges,{' '}
            {rules.filter(r => r.adjustment_type === 'discount').length} discounts
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader className="items-center justify-between">
          <ItemTitle>Revenue Potential</ItemTitle>
          <ItemActions className="flex-none">
            <TrendingUp className="h-4 w-4 text-primary" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalPotentialRevenue)}
          </div>
          <ItemDescription>Estimated monthly increase</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader className="items-center justify-between">
          <ItemTitle>Services Optimized</ItemTitle>
          <ItemActions className="flex-none">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <div className="text-2xl font-bold">{servicesCount}</div>
          <ItemDescription>Dynamic pricing enabled</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
