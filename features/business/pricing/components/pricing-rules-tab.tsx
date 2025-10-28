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
  Clock,
  Calendar,
} from 'lucide-react'

interface PricingRule {
  day_of_week: string
  hour_start: number
  hour_end: number
  adjustment_type: 'discount' | 'surge'
  adjustment_percentage: number
}

interface PricingRulesTabProps {
  rules: PricingRule[]
  formatTime: (hour: number) => string
  getDayName: (day: string) => string
}

export function PricingRulesTab({
  rules,
  formatTime,
  getDayName,
}: PricingRulesTabProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>Active Pricing Rules</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>
                Time-based pricing adjustments for demand optimization
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup className="flex flex-col gap-3">
          {rules.map((rule) => {
            const isSurge = rule.adjustment_type === 'surge'
            const badgeLabel = isSurge
              ? `+${rule.adjustment_percentage}% Surge`
              : `-${rule.adjustment_percentage}% Discount`

            return (
              <Item
                key={`${rule.day_of_week}-${rule.hour_start}-${rule.hour_end}`}
                variant="outline"
                className="items-center justify-between gap-3"
              >
                <ItemContent className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{getDayName(rule.day_of_week)}</Badge>
                  </div>
                  <ItemDescription className="flex items-center gap-2 text-sm">
                    <Clock className="h-3 w-3" />
                    {formatTime(rule.hour_start)} - {formatTime(rule.hour_end)}
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex items-center gap-2">
                  {isSurge ? (
                    <TrendingUp className="h-4 w-4 text-primary" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-secondary" />
                  )}
                  <Badge variant={isSurge ? 'default' : 'secondary'}>{badgeLabel}</Badge>
                </ItemActions>
              </Item>
            )
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
