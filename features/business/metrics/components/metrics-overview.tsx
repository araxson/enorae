'use client'

import { format } from 'date-fns'
import { Calendar, DollarSign, Star, Users } from 'lucide-react'

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
import { CardTitle } from '@/components/ui/card'

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
      <ItemGroup>
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>Salon Metrics</ItemTitle>
            <ItemDescription>
              Last updated: {format(new Date(metrics.updated_at!), 'MMMM dd, yyyy')}
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>

      <ItemGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Item variant="outline" className="flex-col gap-2">
          <ItemHeader className="items-center justify-between">
            <ItemTitle>Total Bookings</ItemTitle>
            <ItemActions className="flex-none">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </ItemHeader>
          <ItemContent>
            <CardTitle>{metrics.total_bookings ?? 'N/A'}</CardTitle>
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
            <CardTitle>{formatCurrency(metrics.total_revenue)}</CardTitle>
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
            <CardTitle>{metrics.rating_average?.toFixed(1) ?? 'N/A'}</CardTitle>
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
            <CardTitle>{metrics.employee_count ?? 'N/A'}</CardTitle>
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
