'use client'

import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, Building2, Briefcase } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Grid, Stack } from '@/components/layout'
import { Muted } from '@/components/ui/typography'
import type {
  RevenueSummary,
  SalonRevenue,
  ServiceRevenue,
  RevenueTimeseries,
} from '../api/queries'

type Props = {
  summary: RevenueSummary
  salonRevenue: SalonRevenue[]
  serviceRevenue: ServiceRevenue[]
  timeseries: RevenueTimeseries[]
}

export function RevenueDashboard({ summary, salonRevenue, serviceRevenue, timeseries }: Props) {
  const formatCurrency = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <Stack gap="xl">
      {/* Summary Cards */}
      <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
            <div className="flex items-center gap-1 text-xs">
              {summary.revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={summary.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}
              >
                {formatPercent(summary.revenueGrowth)}
              </span>
              <Muted>vs previous period</Muted>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalAppointments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Completed bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">Per appointment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Salons</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salonRevenue.length}</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>
      </Grid>

      {/* Revenue by Salon */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Salon</CardTitle>
          <CardDescription>Top performing locations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salon</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Appointments</TableHead>
                <TableHead className="text-right">Avg Order Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salonRevenue.map((salon) => (
                <TableRow key={salon.salonId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {salon.salonName}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(salon.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-right">{salon.appointmentCount}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(salon.averageOrderValue)}
                  </TableCell>
                </TableRow>
              ))}
              {salonRevenue.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Muted>No revenue data available</Muted>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Revenue by Service */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Service</CardTitle>
          <CardDescription>Top revenue-generating services</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceRevenue.map((service) => (
                <TableRow key={service.serviceId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      {service.serviceName}
                    </div>
                  </TableCell>
                  <TableCell>
                    {service.serviceCategory ? (
                      <Badge variant="outline">{service.serviceCategory}</Badge>
                    ) : (
                      <Muted>N/A</Muted>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(service.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-right">{service.bookingCount}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(service.averagePrice)}
                  </TableCell>
                </TableRow>
              ))}
              {serviceRevenue.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Muted>No service data available</Muted>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      {timeseries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timeseries.slice(-30).map((day) => (
                <div key={day.date} className="flex items-center justify-between text-sm">
                  <Muted>{new Date(day.date).toLocaleDateString()}</Muted>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{formatCurrency(day.revenue)}</span>
                    <Badge variant="outline">{day.appointmentCount} bookings</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}
