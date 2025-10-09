'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/layout'
import { Muted, H3 } from '@/components/ui/typography'
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
        <Stack gap="sm">
          <div className="flex items-center justify-between">
            <Muted className="text-sm">{title}</Muted>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between">
            <H3 className="text-2xl font-bold">{value}</H3>
            {trend !== undefined && (
              <Badge variant={trend >= 0 ? 'default' : 'destructive'} className="flex items-center gap-1">
                {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {formatPercentage(trend)}
              </Badge>
            )}
          </div>
          {subtitle && <Muted className="text-xs">{subtitle}</Muted>}
        </Stack>
      </CardContent>
    </Card>
  )
}
