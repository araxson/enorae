'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { PricingInsight } from '@/features/business/pricing/types'
import { formatCurrency } from './pricing-utils'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

interface RevenueInsightsTabProps {
  insights: PricingInsight[]
}

export function RevenueInsightsTab({ insights }: RevenueInsightsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Optimization Insights</CardTitle>
        <CardDescription>
          Potential revenue impact from dynamic pricing
        </CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No revenue insights yet</EmptyTitle>
              <EmptyDescription>Add active pricing rules to generate insights.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => (
              <Card key={insight.service_id}>
                <CardContent className="space-y-4 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">{insight.service_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Base price: {formatCurrency(insight.base_price)}
                      </p>
                    </div>
                    <Badge variant="default">
                      +{formatCurrency(insight.potential_revenue_increase)}/mo
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Off-Peak Price</p>
                        <p className="text-base font-semibold">
                          {formatCurrency(insight.avg_off_peak_price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Peak Price</p>
                        <p className="text-base font-semibold">
                          {formatCurrency(insight.avg_peak_price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
