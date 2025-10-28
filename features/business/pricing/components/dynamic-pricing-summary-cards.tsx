'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Zap } from 'lucide-react'

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
  const surgeCount = rules.filter((rule) => rule.adjustment_type === 'surge').length
  const discountCount = rules.filter((rule) => rule.adjustment_type === 'discount').length

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Active Rules</CardTitle>
          <CardDescription>Pricing adjustments currently applied.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-start justify-between">
            <p className="text-3xl font-semibold tracking-tight">{rules.length}</p>
            <Zap className="size-4 text-primary" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">
            {surgeCount} surges · {discountCount} discounts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Potential</CardTitle>
          <CardDescription>Projected monthly lift from dynamic pricing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-start justify-between">
            <p className="text-3xl font-semibold tracking-tight">
              {formatCurrency(totalPotentialRevenue)}
            </p>
            <TrendingUp className="size-4 text-primary" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">Estimated monthly increase</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services Optimized</CardTitle>
          <CardDescription>Menu items currently using automation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-start justify-between">
            <p className="text-3xl font-semibold tracking-tight">{servicesCount}</p>
            <DollarSign className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">Dynamic pricing enabled</p>
        </CardContent>
      </Card>
    </div>
  )
}
