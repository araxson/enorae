'use client'

import { Users, Calendar, DollarSign, Star } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { H3, Small, Muted } from '@/components/ui/typography'
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
          <Muted>No metrics data available</Muted>
          <Muted className="mt-1">
            Metrics will be generated automatically
          </Muted>
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
          <H3>Salon Metrics</H3>
          <Small className="text-muted-foreground">
            Last updated: {format(new Date(metrics.updated_at!), 'MMMM dd, yyyy')}
          </Small>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <H3>
              {metrics.total_bookings ?? 'N/A'}
            </H3>
            <Muted className="text-xs">
              All time bookings
            </Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <H3>
              {formatCurrency(metrics.total_revenue)}
            </H3>
            <Muted className="text-xs">
              Lifetime earnings
            </Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <H3>
              {metrics.rating_average?.toFixed(1) ?? 'N/A'}
            </H3>
            <Muted className="text-xs">
              {metrics.rating_count ?? 0} reviews
            </Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">
              Employee Count
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <H3>
              {metrics.employee_count ?? 'N/A'}
            </H3>
            <Muted className="text-xs">
              Active staff members
            </Muted>
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
            <Small className="text-muted-foreground">Total Bookings</Small>
            <Small className="font-semibold">{metrics.total_bookings ?? 'N/A'}</Small>
          </div>
          <div className="flex justify-between">
            <Small className="text-muted-foreground">Total Revenue</Small>
            <Small className="font-semibold">{formatCurrency(metrics.total_revenue)}</Small>
          </div>
          <div className="flex justify-between">
            <Small className="text-muted-foreground">Employee Count</Small>
            <Small className="font-semibold">{metrics.employee_count ?? 'N/A'}</Small>
          </div>
          <div className="flex justify-between">
            <Small className="text-muted-foreground">Average Rating</Small>
            <Small className="font-semibold">
              {metrics.rating_average?.toFixed(1) ?? 'N/A'} / 5.0
            </Small>
          </div>
          <div className="flex justify-between">
            <Small className="text-muted-foreground">Total Reviews</Small>
            <Small className="font-semibold">{metrics.rating_count ?? 'N/A'}</Small>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
