'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'
import type { ServicePerformance } from '../../api/queries'
import { formatCurrency } from './utils'

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
          <p className="text-sm text-muted-foreground">
            No popular service data is available yet.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {trendingServices.map((service, index) => (
              <div key={service.service_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={index === 0 ? 'default' : 'outline'}>
                    #{index + 1}
                  </Badge>
                  <div>
                    <h4 className="text-lg font-semibold">{service.service_name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Popularity: {service.popularity_score?.toFixed(0) || 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold">{service.total_bookings} bookings</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(service.total_revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
