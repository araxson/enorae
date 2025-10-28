'use client'

import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import type { ServicePerformance } from '@/features/business/service-performance-analytics/api/queries'
import { getPerformanceIcon, formatCurrency } from './utils'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export function PerformanceOverviewCard({ services }: { services: ServicePerformance[] }) {
  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Service Performance Overview</ItemTitle>
        <ItemDescription>
          Key health metrics for each service across booking, revenue, and satisfaction.
        </ItemDescription>
      </ItemHeader>
      <ItemContent>
        <ItemGroup className="space-y-4">
          {services.map((service) => (
            <Item key={service.service_id} variant="outline" className="flex-col gap-4 py-4">
              <ItemContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{service.service_name}</h4>
                    <div className="mt-1 flex items-center gap-2">
                      {getPerformanceIcon(service.cancellation_rate || 0)}
                      <p className="text-xs text-muted-foreground">
                        {service.cancellation_rate?.toFixed(1) || 0}% cancellation rate
                      </p>
                    </div>
                  </div>
                  <Badge variant={service.cancellation_rate > 20 ? 'destructive' : 'default'}>
                    {service.cancellation_rate > 20 ? 'Needs Attention' : 'Performing Well'}
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                    <p className="font-semibold">{service.total_bookings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-semibold">{formatCurrency(service.total_revenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                    <div className="flex items-center gap-1">
                      <p className="font-semibold">{service.avg_rating?.toFixed(1) || 'N/A'}</p>
                      <Star className="size-4 text-star-filled" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Popularity Score</p>
                    <p className="font-semibold">{service.popularity_score?.toFixed(0) || 0}</p>
                  </div>
                </div>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
