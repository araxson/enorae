'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Star } from 'lucide-react'
import type { ServicePerformance } from '../../api/queries'
import { formatCurrency } from './utils'

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
          <p className="text-sm text-muted-foreground">
            No service performance data is available yet.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {topServices.map((service, index) => (
              <div key={service.service_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={index === 0 ? 'default' : 'secondary'}>
                    #{index + 1}
                  </Badge>
                  <div>
                    <h4 className="text-lg font-semibold font-medium">{service.service_name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {service.total_bookings} bookings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold">{formatCurrency(service.total_revenue)}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3" />
                    {service.avg_rating?.toFixed(1) || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
