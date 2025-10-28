'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import {
  TrendingUp,
  DollarSign,
  Zap,
} from 'lucide-react'

interface PricingRule {
  adjustment_type: 'discount' | 'surge'
}

interface DynamicPricingSummaryCardsProps {
  rules: PricingRule[]
  totalPotentialRevenue: number
  servicesCount: number
  formatCurrency: (amount: number) => string
}

export function DynamicPricingSummaryCards({
  rules,
  totalPotentialRevenue,
  servicesCount,
  formatCurrency,
}: DynamicPricingSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="pb-2">
            <ItemGroup>
              <Item className="items-center justify-between gap-2">
                <ItemContent>
                  <ItemTitle>Active Rules</ItemTitle>
                </ItemContent>
                <ItemActions className="flex-none">
                  <Zap className="h-4 w-4 text-accent" />
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>{rules.length}</CardTitle>
          <CardDescription>
            {rules.filter(r => r.adjustment_type === 'surge').length} surges,{' '}
            {rules.filter(r => r.adjustment_type === 'discount').length} discounts
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="pb-2">
            <ItemGroup>
              <Item className="items-center justify-between gap-2">
                <ItemContent>
                  <ItemTitle>Revenue Potential</ItemTitle>
                </ItemContent>
                <ItemActions className="flex-none">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>{formatCurrency(totalPotentialRevenue)}</CardTitle>
          <CardDescription>
            Estimated monthly increase
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="pb-2">
            <ItemGroup>
              <Item className="items-center justify-between gap-2">
                <ItemContent>
                  <ItemTitle>Services Optimized</ItemTitle>
                </ItemContent>
                <ItemActions className="flex-none">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>{servicesCount}</CardTitle>
          <CardDescription>
            Dynamic pricing enabled
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
