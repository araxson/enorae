'use client'

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
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export function PopularServicesCard({ services }: { services: ServicePerformance[] }) {
  const trendingServices = [...services]
    .sort((a, b) => b.total_bookings - a.total_bookings)
    .slice(0, 5)

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader className="items-start gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <ItemTitle>Most Popular Services</ItemTitle>
        </div>
        <ItemDescription>
          Services with the highest booking volume during the selected period.
        </ItemDescription>
      </ItemHeader>
      <ItemContent>
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
                    <ItemTitle>{service.service_name}</ItemTitle>
                    <ItemDescription>
                      Popularity: {service.popularity_score?.toFixed(0) || 0}
                    </ItemDescription>
                  </div>
                </ItemContent>
                <ItemActions className="flex-none text-right">
                  <p className="text-base font-semibold">{service.total_bookings} bookings</p>
                  <ItemDescription>{formatCurrency(service.total_revenue)}</ItemDescription>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </ItemContent>
    </Item>
  )
}
