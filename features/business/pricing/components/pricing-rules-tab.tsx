'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Clock, Calendar } from 'lucide-react'
import type { PricingRule } from '@/features/business/pricing/types'
import { formatTime, getDayName } from './pricing-utils'
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

interface PricingRulesTabProps {
  rules: PricingRule[]
}

export function PricingRulesTab({ rules }: PricingRulesTabProps) {
  return (
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader>
        <ItemTitle>Active Pricing Rules</ItemTitle>
        <ItemDescription>
          Time-based pricing adjustments for demand optimization
        </ItemDescription>
      </ItemHeader>
      <ItemContent>
        {rules.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No pricing rules yet</EmptyTitle>
              <EmptyDescription>Create a rule to start optimizing pricing.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="space-y-2">
            {rules.map((rule, index) => (
              <Item
                key={`${rule.day_of_week}-${rule.hour_start}-${rule.hour_end}-${index}`}
                variant="outline"
                className="flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <ItemContent className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{getDayName(rule.day_of_week)}</Badge>
                  </div>
                  <ItemDescription className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTime(rule.hour_start)} - {formatTime(rule.hour_end)}
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex items-center gap-2">
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
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </ItemContent>
    </Item>
  )
}
