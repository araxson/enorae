'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import {
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

interface PricingInsight {
  service_id: string
  service_name: string
  base_price: number
  avg_off_peak_price: number
  avg_peak_price: number
  potential_revenue_increase: number
}

interface RevenueInsightsTabProps {
  insights: PricingInsight[]
  formatCurrency: (amount: number) => string
}

export function RevenueInsightsTab({
  insights,
  formatCurrency,
}: RevenueInsightsTabProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>Revenue Optimization Insights</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>
                Potential revenue impact from dynamic pricing
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup className="flex flex-col gap-3">
          {insights.map((insight) => (
            <Item key={insight.service_id} variant="outline" className="flex-col gap-3">
              <ItemContent className="flex items-start justify-between gap-4">
                <div>
                  <ItemTitle>{insight.service_name}</ItemTitle>
                  <ItemDescription>
                    Base price: {formatCurrency(insight.base_price)}
                  </ItemDescription>
                </div>
                <ItemActions className="flex-none">
                  <Badge>+{formatCurrency(insight.potential_revenue_increase)}/mo</Badge>
                </ItemActions>
              </ItemContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Off-Peak Price</p>
                    <p className="font-semibold">
                      {formatCurrency(insight.avg_off_peak_price)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Peak Price</p>
                    <p className="font-semibold">
                      {formatCurrency(insight.avg_peak_price)}
                    </p>
                  </div>
                </div>
              </div>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
