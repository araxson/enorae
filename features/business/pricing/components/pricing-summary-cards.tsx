'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, DollarSign, Zap } from 'lucide-react'
import type { PricingRule } from '../types'
import { formatCurrency } from './pricing-utils'

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
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Active Rules</CardTitle>
          <Zap className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rules.length}</div>
          <p className="text-xs text-muted-foreground">
            {rules.filter(r => r.adjustment_type === 'surge').length} surges,{' '}
            {rules.filter(r => r.adjustment_type === 'discount').length} discounts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Revenue Potential</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalPotentialRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Estimated monthly increase
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Services Optimized</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{servicesCount}</div>
          <p className="text-xs text-muted-foreground">
            Dynamic pricing enabled
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
