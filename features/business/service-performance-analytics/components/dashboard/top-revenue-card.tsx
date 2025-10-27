'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Star } from 'lucide-react'
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

export function TopRevenueCard({ services }: { services: ServicePerformance[] }) {
  const topServices = [...services]
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 5)

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          <CardTitle>Top Revenue Generators</CardTitle>
        </div>
        <CardDescription>Highest earning services ranked by total revenue.</CardDescription>
      </CardHeader>
      <CardContent>
        {topServices.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No service performance data</EmptyTitle>
              <EmptyDescription>Track completed appointments to see revenue rankings.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>Encourage bookings or import historical data to populate this list.</EmptyContent>
          </Empty>
        ) : (
          <ItemGroup className="flex flex-col gap-4">
            {topServices.map((service, index) => (
              <Item key={service.service_id}>
                <ItemContent className="flex items-center gap-3">
                  <Badge variant={index === 0 ? 'default' : 'secondary'}>
                    #{index + 1}
                  </Badge>
                  <div>
                    <ItemTitle className="text-lg font-semibold">{service.service_name}</ItemTitle>
                    <ItemDescription className="text-xs text-muted-foreground">
                      {service.total_bookings} bookings
                    </ItemDescription>
                  </div>
                </ItemContent>
                <ItemActions className="flex-none text-right">
                  <p className="text-xs font-semibold">{formatCurrency(service.total_revenue)}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3" />
                    {service.avg_rating?.toFixed(1) || 'N/A'}
                  </div>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
