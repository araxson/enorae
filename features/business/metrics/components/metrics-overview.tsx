'use client'

import { format } from 'date-fns'
import { Users, Calendar, DollarSign, Star } from 'lucide-react'

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

import type { SalonMetricsData } from '@/features/business/metrics/api/queries'

type MetricsOverviewProps = {
  metrics: SalonMetricsData | null
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  if (!metrics) {
    return (
      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader className="items-center justify-center">
          <ItemTitle>No metrics data available</ItemTitle>
          <ItemDescription>Metrics will be generated automatically.</ItemDescription>
        </ItemHeader>
        <ItemContent className="flex flex-col items-center justify-center py-6">
          <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
        </ItemContent>
      </Item>
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

      <ItemGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Item variant="outline" className="flex-col gap-2">
          <ItemHeader className="items-center justify-between">
            <ItemTitle>Total Bookings</ItemTitle>
            <ItemActions className="flex-none">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </ItemHeader>
          <ItemContent>
            <div className="text-2xl font-semibold">{metrics.total_bookings ?? 'N/A'}</div>
            <ItemDescription>All time bookings</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline" className="flex-col gap-2">
          <ItemHeader className="items-center justify-between">
            <ItemTitle>Total Revenue</ItemTitle>
            <ItemActions className="flex-none">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </ItemHeader>
          <ItemContent>
            <div className="text-2xl font-semibold">{formatCurrency(metrics.total_revenue)}</div>
            <ItemDescription>Lifetime earnings</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline" className="flex-col gap-2">
          <ItemHeader className="items-center justify-between">
            <ItemTitle>Average Rating</ItemTitle>
            <ItemActions className="flex-none">
              <Star className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </ItemHeader>
          <ItemContent>
            <div className="text-2xl font-semibold">
              {metrics.rating_average?.toFixed(1) ?? 'N/A'}
            </div>
            <ItemDescription>{metrics.rating_count ?? 0} reviews</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline" className="flex-col gap-2">
          <ItemHeader className="items-center justify-between">
            <ItemTitle>Employee Count</ItemTitle>
            <ItemActions className="flex-none">
              <Users className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </ItemHeader>
          <ItemContent>
            <div className="text-2xl font-semibold">{metrics.employee_count ?? 'N/A'}</div>
            <ItemDescription>Active staff members</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Metrics Summary</ItemTitle>
          <ItemDescription>
            Core business metrics for {metrics.salon?.name || 'your salon'}
          </ItemDescription>
        </ItemHeader>
        <ItemContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Total Bookings</TableCell>
                <TableCell className="text-right font-semibold">{metrics.total_bookings ?? 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Total Revenue</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(metrics.total_revenue)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Employee Count</TableCell>
                <TableCell className="text-right font-semibold">{metrics.employee_count ?? 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Average Rating</TableCell>
                <TableCell className="text-right font-semibold">
                  {metrics.rating_average?.toFixed(1) ?? 'N/A'} / 5.0
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Total Reviews</TableCell>
                <TableCell className="text-right font-semibold">{metrics.rating_count ?? 'N/A'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ItemContent>
      </Item>
    </div>
  )
}
