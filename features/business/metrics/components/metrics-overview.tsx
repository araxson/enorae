'use client'

import { format } from 'date-fns'
import { Users, Calendar, DollarSign, Star } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { SalonMetricsData } from '@/features/business/metrics/api/queries'

type MetricsOverviewProps = {
  metrics: SalonMetricsData | null
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  if (!metrics) {
    return (
      <Card>
        <CardHeader className="items-center justify-center">
          <CardTitle>No metrics data available</CardTitle>
          <CardDescription>Metrics will be generated automatically.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Salon Metrics</h3>
          <p className="text-sm text-muted-foreground">
            Last updated: {format(new Date(metrics.updated_at!), 'MMMM dd, yyyy')}
          </p>
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
            <div className="text-2xl font-semibold">
              {metrics.total_bookings ?? 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
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
            <div className="text-2xl font-semibold">
              {formatCurrency(metrics.total_revenue)}
            </div>
            <p className="text-xs text-muted-foreground">
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
            <div className="text-2xl font-semibold">
              {metrics.rating_average?.toFixed(1) ?? 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
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
            <div className="text-2xl font-semibold">
              {metrics.employee_count ?? 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
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
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Bookings</span>
            <span className="font-semibold">{metrics.total_bookings ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Revenue</span>
            <span className="font-semibold">{formatCurrency(metrics.total_revenue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Employee Count</span>
            <span className="font-semibold">{metrics.employee_count ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Average Rating</span>
            <span className="font-semibold">
              {metrics.rating_average?.toFixed(1) ?? 'N/A'} / 5.0
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Reviews</span>
            <span className="font-semibold">{metrics.rating_count ?? 'N/A'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
