import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { PlatformMetricCard } from './platform-metric-card'
import { getPlatformMetricsConfig } from './platform-metrics-config'

interface PlatformMetricsProps {
  metrics: {
    totalSalons: number
    totalUsers: number
    totalAppointments: number
    activeAppointments: number
    revenue: number
    activeUsers: number
    pendingVerifications: number
  }
}

export function PlatformMetrics({ metrics }: PlatformMetricsProps) {
  const cards = getPlatformMetricsConfig(metrics)

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemContent>
          <ItemTitle>Platform metrics</ItemTitle>
          <ItemDescription>
            Core KPIs refresh every minute so you can respond quickly.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="outline">
            <TrendingUp className="size-4" aria-hidden="true" /> Live stats
          </Badge>
        </ItemActions>
      </ItemHeader>
      <ItemContent>
        <ItemGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {cards.map(({ key, ...card }) => (
            <PlatformMetricCard key={key} {...card} />
          ))}
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
