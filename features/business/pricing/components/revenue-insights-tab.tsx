'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { PricingInsight } from '../types'
import { formatCurrency } from './pricing-utils'

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
          <div className="py-8 text-center text-muted-foreground">
            No revenue insights yet. Add active pricing rules to generate insights.
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.service_id}
                className="border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between mb-2">
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
                <div className="grid grid-cols-2 gap-4 mt-3">
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
