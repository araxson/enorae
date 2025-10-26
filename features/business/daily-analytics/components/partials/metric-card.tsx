'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ComponentType } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { formatPercentage } from '@/features/business/business-common'

type Props = {
  title: string
  value: string | number
  trend?: number
  icon: ComponentType<{ className?: string }>
  subtitle?: string
}

export function MetricCard({ title, value, trend, icon: Icon, subtitle }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
        {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined ? (
          <div className="flex items-center gap-1">
            {trend >= 0 ? <TrendingUp className="h-3 w-3" aria-hidden="true" /> : <TrendingDown className="h-3 w-3" aria-hidden="true" />}
            <Badge variant={trend >= 0 ? 'default' : 'destructive'}>{formatPercentage(trend)}</Badge>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
