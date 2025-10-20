'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Grid } from '@/components/layout'
import { TrendingUp, TrendingDown, DollarSign, Star, BarChart3, Users, Link2 } from 'lucide-react'
import type { ServicePerformance } from '../api/queries'

type ServiceProfitability = {
  service_id: string
  service_name: string
  revenue: number
  cost: number
  profit: number
  margin: number
}

type StaffLeader = {
  service_id: string
  service_name: string
  staff: Array<{ staff_id: string; staff_name: string; appointmentCount: number; revenue: number }>
}

type ServicePairing = {
  primary: string
  paired: string
  count: number
}

type DurationAccuracy = {
  service_id: string
  service_name: string
  expected_duration: number | null
  actual_duration: number | null
  variance: number | null
}

type Props = {
  services: ServicePerformance[]
  profitability: ServiceProfitability[]
  staffPerformance: StaffLeader[]
  pairings: ServicePairing[]
  durationAccuracy: DurationAccuracy[]
}

export function ServicePerformanceDashboard({
  services,
  profitability,
  staffPerformance,
  pairings,
  durationAccuracy,
}: Props) {
  const topServices = [...services]
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 5)

  const trendingServices = [...services]
    .sort((a, b) => b.total_bookings - a.total_bookings)
    .slice(0, 5)

  const mostProfitable = [...profitability]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5)

  const getPerformanceIcon = (cancellationRate: number) => {
    if (cancellationRate < 10) return <TrendingUp className="h-4 w-4 text-success" />
    if (cancellationRate > 20) return <TrendingDown className="h-4 w-4 text-destructive" />
    return <BarChart3 className="h-4 w-4 text-warning" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <Stack gap="xl">
      <Grid cols={{ base: 1, md: 3 }} gap="lg">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <CardTitle>Top Revenue Generators</CardTitle>
            </div>
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
                      <Star className="h-3 w-3 text-warning" />
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
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <CardTitle>Most Popular Services</CardTitle>
            </div>
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
          <CardTitle>Profitability by Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mostProfitable.map((entry) => (
            <div key={entry.service_id} className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <p className="font-medium">{entry.service_name}</p>
                <p className="text-xs text-muted-foreground">
                  Margin {Number.isFinite(entry.margin) ? entry.margin.toFixed(1) : '0'}%
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold">{formatCurrency(entry.profit)}</p>
                <p className="text-muted-foreground">
                  Revenue {formatCurrency(entry.revenue)} · Cost {formatCurrency(entry.cost)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

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
                      <Star className="h-4 w-4 text-warning" />
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

      <Grid cols={{ base: 1, md: 2 }} gap="lg">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Staff Leaders by Service</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {staffPerformance.map((record) => (
              <div key={record.service_id} className="rounded-md border p-3">
                <p className="font-medium mb-2">{record.service_name}</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {record.staff.slice(0, 3).map((staff) => (
                    <div key={staff.staff_id} className="flex justify-between">
                      <span>{staff.staff_name}</span>
                      <span>
                        {staff.appointmentCount} appts · {formatCurrency(staff.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              <CardTitle>Service Pairings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {pairings.map((pair) => (
              <div key={`${pair.primary}-${pair.paired}`} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div>
                  <p className="font-medium">{pair.primary}</p>
                  <p className="text-xs text-muted-foreground">Often paired with {pair.paired}</p>
                </div>
                <Badge variant="secondary">{pair.count} combos</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <CardHeader>
          <CardTitle>Duration Accuracy</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {durationAccuracy.map((entry) => (
            <div key={entry.service_id} className="rounded-md border p-3">
              <p className="font-medium">{entry.service_name}</p>
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>Scheduled</span>
                <span>{entry.expected_duration ? `${entry.expected_duration} min` : 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Actual</span>
                <span>{entry.actual_duration ? `${entry.actual_duration} min` : 'N/A'}</span>
              </div>
              {entry.variance != null && (
                <Badge variant={Math.abs(entry.variance) > 10 ? 'destructive' : 'outline'} className="mt-2">
                  {entry.variance > 0 ? '+' : ''}{entry.variance} min variance
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </Stack>
  )
}
