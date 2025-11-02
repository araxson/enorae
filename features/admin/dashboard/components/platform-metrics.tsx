import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
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
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Platform metrics</CardTitle>
              <CardDescription>
                Core KPIs refresh every minute so you can respond quickly.
              </CardDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="outline">
                <TrendingUp className="size-4" aria-hidden="true" /> Live stats
              </Badge>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {cards.map((card) => (
            <PlatformMetricCard key={card.key} {...card} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
