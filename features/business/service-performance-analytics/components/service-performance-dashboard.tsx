'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, BarChart3, Users, Link2, Star } from 'lucide-react'
import type { ServicePerformance } from '@/features/business/service-performance-analytics/api/queries'
import { RevenueLeaders } from './partials/revenue-leaders'
import { PopularityRanking } from './partials/popularity-ranking'
import { formatCurrency } from './partials/format-utils'

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
  const mostProfitable = [...profitability]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5)

  const getPerformanceIcon = (cancellationRate: number) => {
    if (cancellationRate < 10) return <TrendingUp className="h-4 w-4 text-primary" />
    if (cancellationRate > 20) return <TrendingDown className="h-4 w-4 text-destructive" />
    return <BarChart3 className="h-4 w-4 text-accent" />
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <RevenueLeaders services={services} formatCurrency={formatCurrency} />
        <PopularityRanking services={services} formatCurrency={formatCurrency} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profitability by Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mostProfitable.map((entry) => (
            <div key={entry.service_id} className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <p className="">{entry.service_name}</p>
                <p className="text-muted-foreground">
                  Margin {Number.isFinite(entry.margin) ? entry.margin.toFixed(1) : '0'}%
                </p>
              </div>
              <div className="text-right">
                <p className="">{formatCurrency(entry.profit)}</p>
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
                    <h4>{service.service_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getPerformanceIcon(service.cancellation_rate || 0)}
                      <span className="text-muted-foreground">
                        {service.cancellation_rate?.toFixed(1) || 0}% cancellation rate
                      </span>
                    </div>
                  </div>
                  <Badge variant={service.cancellation_rate > 20 ? 'destructive' : 'default'}>
                    {service.cancellation_rate > 20 ? 'Needs Attention' : 'Performing Well'}
                  </Badge>
                </div>

                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground">Total Bookings</p>
                    <p className="">{service.total_bookings}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="">{formatCurrency(service.total_revenue)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Rating</p>
                    <div className="flex items-center gap-1">
                      <p className="">{service.avg_rating?.toFixed(1) || 'N/A'}</p>
                      <Star className="h-4 w-4 text-accent" />
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Popularity Score</p>
                    <p className="">{service.popularity_score?.toFixed(0) || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Staff Leaders by Service</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {staffPerformance.map((record) => (
              <Card key={record.service_id}>
                <CardHeader className="pb-2">
                  <CardTitle>{record.service_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 pt-0 text-muted-foreground">
                  {record.staff.slice(0, 3).map((staff) => (
                    <div key={staff.staff_id} className="flex justify-between">
                      <span>{staff.staff_name}</span>
                      <span>
                        {staff.appointmentCount} appts · {formatCurrency(staff.revenue)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
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
          <CardContent className="space-y-2">
            {pairings.map((pair) => (
              <Card key={`${pair.primary}-${pair.paired}`}>
                <CardHeader className="pb-2">
                  <CardTitle>{pair.primary}</CardTitle>
                  <CardDescription>Often paired with {pair.paired}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-0">
                  <Badge variant="secondary">{pair.count} combos</Badge>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Duration Accuracy</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {durationAccuracy.map((entry) => (
            <Card key={entry.service_id}>
              <CardHeader className="pb-2">
                <CardTitle>{entry.service_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Scheduled</span>
                  <span>{entry.expected_duration ? `${entry.expected_duration} min` : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Actual</span>
                  <span>{entry.actual_duration ? `${entry.actual_duration} min` : 'N/A'}</span>
                </div>
                {entry.variance != null ? (
                  <Badge variant={Math.abs(entry.variance) > 10 ? 'destructive' : 'outline'}>
                    {entry.variance > 0 ? '+' : ''}{entry.variance} min variance
                  </Badge>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
