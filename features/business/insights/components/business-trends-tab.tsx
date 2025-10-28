'use client'

import {
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

import type { TrendInsight } from '@/features/business/insights/api/queries'

interface BusinessTrendsTabProps {
  trends: TrendInsight[]
}

export function BusinessTrendsTab({ trends }: BusinessTrendsTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Trend analysis</h3>
        <p className="text-sm text-muted-foreground">Track movement across your key business metrics.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {trends.map((trend, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <Item variant="muted" className="flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <ItemContent className="gap-1">
                    <ItemTitle>{trend.metric}</ItemTitle>
                    <ItemDescription>{trend.message}</ItemDescription>
                  </ItemContent>
                  <ItemMedia variant="icon">
                    {trend.trend === 'up' ? (
                      <TrendingUp
                        className={`h-6 w-6 ${
                          trend.status === 'positive' ? 'text-primary' : 'text-destructive'
                        }`}
                        aria-hidden="true"
                      />
                    ) : trend.trend === 'down' ? (
                      <TrendingDown
                        className={`h-6 w-6 ${
                          trend.status === 'negative' ? 'text-destructive' : 'text-primary'
                        }`}
                        aria-hidden="true"
                      />
                    ) : (
                      <Minus className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                    )}
                  </ItemMedia>
                </div>
                <div className="flex items-baseline gap-2">
                  <CardTitle
                    className={
                      trend.status === 'positive'
                        ? 'text-primary'
                        : trend.status === 'negative'
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }
                  >
                    {trend.changePercent.toFixed(1)}%
                  </CardTitle>
                  <Badge
                    variant={
                      trend.status === 'positive'
                        ? 'default'
                        : trend.status === 'negative'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {trend.status}
                  </Badge>
                </div>
              </Item>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
