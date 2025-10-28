'use client'

import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { formatPercentage } from '@/features/business/business-common'
import type { ComponentType } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'

type Props = {
  title: string
  value: string | number
  trend?: number
  icon: ComponentType<{ className?: string }>
  subtitle?: string
}

export function MetricCard({ title, value, trend, icon: Icon, subtitle }: Props) {
  return (
    <Item variant="outline" className="flex-col gap-2">
      <ItemHeader className="items-center justify-between">
        <ItemTitle>{title}</ItemTitle>
        <ItemActions className="flex-none">
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </ItemActions>
      </ItemHeader>
      {subtitle ? <ItemDescription>{subtitle}</ItemDescription> : null}
      <ItemContent className="flex items-end justify-between gap-3">
        <CardTitle>{value}</CardTitle>
        {trend !== undefined ? (
          <div className="flex items-center gap-1">
            {trend >= 0 ? <TrendingUp className="h-3 w-3" aria-hidden="true" /> : <TrendingDown className="h-3 w-3" aria-hidden="true" />}
            <Badge variant={trend >= 0 ? 'default' : 'destructive'}>{formatPercentage(trend)}</Badge>
          </div>
        ) : null}
      </ItemContent>
    </Item>
  )
}
