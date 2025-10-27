'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Clock, Calendar } from 'lucide-react'
import type { PricingRule } from '@/features/business/pricing/types'
import { formatTime, getDayName } from './pricing-utils'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

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
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No pricing rules yet</EmptyTitle>
              <EmptyDescription>Create a rule to start optimizing pricing.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <Card key={`${rule.day_of_week}-${rule.hour_start}-${rule.hour_end}-${index}`}>
                <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base font-medium text-foreground">
                        {getDayName(rule.day_of_week)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <p className="text-sm text-muted-foreground">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
