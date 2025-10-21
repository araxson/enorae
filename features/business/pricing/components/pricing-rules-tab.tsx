'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Clock, Calendar } from 'lucide-react'
import type { PricingRule } from '../types'
import { formatTime, getDayName } from './pricing-utils'

interface PricingRulesTabProps {
  rules: PricingRule[]
}

export function PricingRulesTab({ rules }: PricingRulesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Pricing Rules</CardTitle>
        <CardDescription>
          Time-based pricing adjustments for demand optimization
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rules.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No pricing rules yet. Create a rule to start optimizing pricing.
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base mt-0 font-medium text-foreground">
                      {getDayName(rule.day_of_week)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <p className="text-base mt-0 text-sm text-muted-foreground">
                      {formatTime(rule.hour_start)} - {formatTime(rule.hour_end)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rule.adjustment_type === 'surge' ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <Badge variant="default">
                        +{rule.adjustment_percentage}% Surge
                      </Badge>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-secondary" />
                      <Badge variant="outline">
                        -{rule.adjustment_percentage}% Discount
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
