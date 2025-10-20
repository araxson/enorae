'use client'

import { Users, Calendar, DollarSign, Star } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { SalonMetricsData } from '../api/queries'
import { format } from 'date-fns'

type MetricsOverviewProps = {
  metrics: SalonMetricsData | null
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  if (!metrics) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">No metrics data available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Metrics will be generated automatically
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Salon Metrics</h3>
          <small className="text-sm font-medium leading-none text-muted-foreground">
            Last updated: {format(new Date(metrics.updated_at!), 'MMMM dd, yyyy')}
          </small>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {metrics.total_bookings ?? 'N/A'}
            </h3>
            <p className="text-sm text-muted-foreground text-xs">
              All time bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {formatCurrency(metrics.total_revenue)}
            </h3>
            <p className="text-sm text-muted-foreground text-xs">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {metrics.rating_average?.toFixed(1) ?? 'N/A'}
            </h3>
            <p className="text-sm text-muted-foreground text-xs">
              {metrics.rating_count ?? 0} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              Employee Count
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {metrics.employee_count ?? 'N/A'}
            </h3>
            <p className="text-sm text-muted-foreground text-xs">
              Active staff members
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metrics Summary</CardTitle>
          <CardDescription>
            Core business metrics for {metrics.salon?.name || 'your salon'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <small className="text-sm font-medium leading-none text-muted-foreground">Total Bookings</small>
            <small className="text-sm font-medium leading-none font-semibold">{metrics.total_bookings ?? 'N/A'}</small>
          </div>
          <div className="flex justify-between">
            <small className="text-sm font-medium leading-none text-muted-foreground">Total Revenue</small>
            <small className="text-sm font-medium leading-none font-semibold">{formatCurrency(metrics.total_revenue)}</small>
          </div>
          <div className="flex justify-between">
            <small className="text-sm font-medium leading-none text-muted-foreground">Employee Count</small>
            <small className="text-sm font-medium leading-none font-semibold">{metrics.employee_count ?? 'N/A'}</small>
          </div>
          <div className="flex justify-between">
            <small className="text-sm font-medium leading-none text-muted-foreground">Average Rating</small>
            <small className="text-sm font-medium leading-none font-semibold">
              {metrics.rating_average?.toFixed(1) ?? 'N/A'} / 5.0
            </small>
          </div>
          <div className="flex justify-between">
            <small className="text-sm font-medium leading-none text-muted-foreground">Total Reviews</small>
            <small className="text-sm font-medium leading-none font-semibold">{metrics.rating_count ?? 'N/A'}</small>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
