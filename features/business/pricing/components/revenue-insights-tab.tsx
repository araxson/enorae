'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { PricingInsight } from '@/features/business/pricing/types'
import { formatCurrency } from './pricing-utils'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

interface RevenueInsightsTabProps {
  insights: PricingInsight[]
}

export function RevenueInsightsTab({ insights }: RevenueInsightsTabProps) {
  return (
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader>
        <ItemTitle>Revenue Optimization Insights</ItemTitle>
        <ItemDescription>
          Potential revenue impact from dynamic pricing
        </ItemDescription>
      </ItemHeader>
      <ItemContent>
        {insights.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No revenue insights yet</EmptyTitle>
              <EmptyDescription>Add active pricing rules to generate insights.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="space-y-3">
            {insights.map((insight) => (
              <Item key={insight.service_id} variant="outline" className="flex-col gap-4 py-4">
                <ItemContent className="flex items-start justify-between gap-4">
                  <div>
                    <ItemTitle>{insight.service_name}</ItemTitle>
                    <ItemDescription>
                      Base price: {formatCurrency(insight.base_price)}
                    </ItemDescription>
                  </div>
                  <ItemActions className="flex-none">
                    <Badge variant="default">
                      +{formatCurrency(insight.potential_revenue_increase)}/mo
                    </Badge>
                  </ItemActions>
                </ItemContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-secondary" />
                    <div>
                      <ItemDescription>Off-Peak Price</ItemDescription>
                      <p className="text-base font-semibold">
                        {formatCurrency(insight.avg_off_peak_price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <div>
                      <ItemDescription>Peak Price</ItemDescription>
                      <p className="text-base font-semibold">
                        {formatCurrency(insight.avg_peak_price)}
                      </p>
                    </div>
                  </div>
                </div>
              </Item>
            ))}
          </ItemGroup>
        )}
      </ItemContent>
    </Item>
  )
}
