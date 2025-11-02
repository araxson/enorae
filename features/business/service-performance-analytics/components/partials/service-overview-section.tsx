'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, BarChart3, Star } from 'lucide-react'
import type { ServicePerformance } from '@/features/business/service-performance-analytics/api/queries'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function ServiceOverviewSection({ services }: { services: ServicePerformance[] }) {
  const getPerformanceIcon = (cancellationRate: number) => {
    if (cancellationRate < 10) return <TrendingUp className="size-4 text-primary" />
    if (cancellationRate > 20) return <TrendingDown className="size-4 text-destructive" />
    return <BarChart3 className="size-4 text-accent" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.service_id}>
              <CardContent className="space-y-4">
                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">{service.service_name}</h4>
                      <div className="mt-1 flex items-center gap-2">
                        {getPerformanceIcon(service.cancellation_rate || 0)}
                        <span className="text-muted-foreground">
                          {service.cancellation_rate?.toFixed(1) || 0}% cancellation rate
                        </span>
                      </div>
                    </ItemContent>
                    <ItemActions className="flex-none">
                      <Badge variant={service.cancellation_rate > 20 ? 'destructive' : 'default'}>
                        {service.cancellation_rate > 20 ? 'Needs Attention' : 'Performing Well'}
                      </Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>

                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground">Total Bookings</p>
                    <p>{service.total_bookings}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p>{formatCurrency(service.total_revenue)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Rating</p>
                    <div className="flex items-center gap-1">
                      <p>{service.avg_rating?.toFixed(1) || 'N/A'}</p>
                      <Star className="size-4 text-accent" />
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Popularity Score</p>
                    <p>{service.popularity_score?.toFixed(0) || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
