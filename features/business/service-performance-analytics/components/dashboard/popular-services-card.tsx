'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'
import type { ServicePerformance } from '@/features/business/service-performance-analytics/api/queries'
import { formatCurrency } from './utils'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

export function PopularServicesCard({ services }: { services: ServicePerformance[] }) {
  const trendingServices = [...services]
    .sort((a, b) => b.total_bookings - a.total_bookings)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <CardTitle>Most Popular Services</CardTitle>
        </div>
        <CardDescription>Services with the highest booking volume during the selected period.</CardDescription>
      </CardHeader>
      <CardContent>
        {trendingServices.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No popular service data</EmptyTitle>
              <EmptyDescription>Bookings will populate this list when services gain traction.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>Promote services or offer discounts to generate engagement.</EmptyContent>
          </Empty>
        ) : (
          <ItemGroup className="flex flex-col gap-4">
            {trendingServices.map((service, index) => (
              <Item key={service.service_id}>
                <ItemContent className="flex items-center gap-3">
                  <Badge variant={index === 0 ? 'default' : 'outline'}>
                    #{index + 1}
                  </Badge>
                  <div>
                    <ItemTitle className="text-lg font-semibold">{service.service_name}</ItemTitle>
                    <ItemDescription className="text-xs text-muted-foreground">
                      Popularity: {service.popularity_score?.toFixed(0) || 0}
                    </ItemDescription>
                  </div>
                </ItemContent>
                <ItemActions className="flex-none text-right">
                  <p className="text-base font-semibold">{service.total_bookings} bookings</p>
                  <ItemDescription className="text-xs text-muted-foreground">
                    {formatCurrency(service.total_revenue)}
                  </ItemDescription>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
