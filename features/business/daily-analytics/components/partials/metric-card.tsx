'use client'

import { Badge } from '@/components/ui/badge'
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
  const valueClass = 'text-2xl font-semibold leading-none tracking-tight'

  return (
    <Item variant="outline" className="flex-col gap-2">
      <ItemHeader>
        <ItemTitle>{title}</ItemTitle>
        <ItemActions>
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        </ItemActions>
      </ItemHeader>
      {subtitle ? <ItemDescription>{subtitle}</ItemDescription> : null}
      <ItemContent className="flex items-end justify-between gap-3">
        <p className={valueClass}>{value}</p>
        {trend !== undefined ? (
          <div className="flex items-center gap-1">
            {trend >= 0 ? <TrendingUp className="size-3" aria-hidden="true" /> : <TrendingDown className="size-3" aria-hidden="true" />}
            <Badge variant={trend >= 0 ? 'default' : 'destructive'}>{formatPercentage(trend)}</Badge>
          </div>
        ) : null}
      </ItemContent>
    </Item>
  )
}
