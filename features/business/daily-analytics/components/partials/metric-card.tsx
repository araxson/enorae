'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ComponentType } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { formatPercentage } from '../utils/value-formatters'

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
      <CardContent className="p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground text-sm">{title}</p>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between">
            <h3 className="scroll-m-20 text-2xl font-semibold text-2xl font-bold">{value}</h3>
            {trend !== undefined && (
              <Badge variant={trend >= 0 ? 'default' : 'destructive'} className="flex items-center gap-1">
                {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {formatPercentage(trend)}
              </Badge>
            )}
          </div>
          {subtitle && <p className="text-sm text-muted-foreground text-xs">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
