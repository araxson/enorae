'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Grid } from '@/components/layout'
import { TrendingUp, TrendingDown, DollarSign, Star, XCircle, BarChart3 } from 'lucide-react'
import type { ServicePerformance } from '../api/queries'

type Props = {
  services: ServicePerformance[]
  revenueByService: Record<string, number>
}

export function ServicePerformanceDashboard({ services, revenueByService }: Props) {
  const topServices = [...services]
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 5)

  const trendingServices = [...services]
    .sort((a, b) => b.total_bookings - a.total_bookings)
    .slice(0, 5)

  const getPerformanceIcon = (cancellationRate: number) => {
    if (cancellationRate < 10) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (cancellationRate > 20) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <BarChart3 className="h-4 w-4 text-yellow-500" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <Stack gap="xl">
      <Grid cols={{ base: 1, md: 2 }} gap="lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Top Revenue Generators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              {topServices.map((service, index) => (
                <div key={service.service_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                      #{index + 1}
                    </Badge>
                    <div>
                      <h4 className="font-medium">{service.service_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {service.total_bookings} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(service.total_revenue)}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3" />
                      {service.avg_rating?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Popular Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              {trendingServices.map((service, index) => (
                <div key={service.service_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={index === 0 ? 'default' : 'outline'}>
                      #{index + 1}
                    </Badge>
                    <div>
                      <h4 className="font-medium">{service.service_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Popularity: {service.popularity_score?.toFixed(0) || 0}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{service.total_bookings} bookings</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(service.total_revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <CardHeader>
          <CardTitle>Service Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.service_id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{service.service_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getPerformanceIcon(service.cancellation_rate || 0)}
                      <span className="text-sm text-muted-foreground">
                        {service.cancellation_rate?.toFixed(1) || 0}% cancellation rate
                      </span>
                    </div>
                  </div>
                  <Badge variant={service.cancellation_rate > 20 ? 'destructive' : 'default'}>
                    {service.cancellation_rate > 20 ? 'Needs Attention' : 'Performing Well'}
                  </Badge>
                </div>

                <Grid cols={{ base: 2, md: 4 }} gap="md">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-xl font-semibold">{service.total_bookings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-xl font-semibold">{formatCurrency(service.total_revenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-semibold">{service.avg_rating?.toFixed(1) || 'N/A'}</p>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Popularity Score</p>
                    <p className="text-xl font-semibold">{service.popularity_score?.toFixed(0) || 0}</p>
                  </div>
                </Grid>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Stack>
  )
}
