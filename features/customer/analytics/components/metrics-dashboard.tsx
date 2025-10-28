'use client'

import { Fragment } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Calendar, CheckCircle2, XCircle, TrendingUp } from 'lucide-react'
import type { CustomerMetrics } from '@/features/customer/analytics/api/queries'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface MetricsDashboardProps {
  metrics: CustomerMetrics
}

export function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  const stats = [
    {
      title: 'Total Spending',
      value: `$${metrics.totalSpending.toFixed(2)}`,
      icon: DollarSign,
      description: 'Total amount spent',
    },
    {
      title: 'Total Appointments',
      value: metrics.totalAppointments.toString(),
      icon: Calendar,
      description: 'All appointments booked',
    },
    {
      title: 'Completed',
      value: metrics.completedAppointments.toString(),
      icon: CheckCircle2,
      description: 'Completed visits',
    },
    {
      title: 'Cancelled',
      value: metrics.cancelledAppointments.toString(),
      icon: XCircle,
      description: 'Cancellations recorded',
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card key={stat['title']}>
              <CardHeader>
                <CardTitle>{stat['title']}</CardTitle>
                <CardDescription>{stat['description']}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Favorite services</CardTitle>
          <CardDescription>Your most booked services</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.favoriteServices.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <TrendingUp className="size-6" aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No favorite services yet</EmptyTitle>
                <EmptyDescription>
                  Book more appointments to see your most-loved services appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup className="gap-2">
              {metrics.favoriteServices.map((service, index) => (
                <Fragment key={`${service.service}-${index}`}>
                  <Item>
                    <ItemContent>
                      <ItemTitle>{service.service}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant="secondary">
                        {service.count} {service.count === 1 ? 'booking' : 'bookings'}
                      </Badge>
                    </ItemActions>
                  </Item>
                  {index < metrics.favoriteServices.length - 1 ? <ItemSeparator /> : null}
                </Fragment>
              ))}
            </ItemGroup>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest customer appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.recentActivity.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Calendar className="size-6" aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No recent activity</EmptyTitle>
                <EmptyDescription>
                  Recent appointments will display here once you start booking.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup className="gap-2">
              {metrics.recentActivity.map((appointment, index) => {
                const statusLabel = appointment['status']
                  ? appointment['status']
                      .split('_')
                      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                      .join(' ')
                  : 'Status'
                return (
                  <Fragment key={appointment['id']}>
                    <Item>
                      <ItemContent>
                        <ItemTitle>{appointment['service_name'] || 'Service'}</ItemTitle>
                        <ItemDescription>{appointment['salon_name'] || 'Salon'}</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <div className="flex flex-col items-end gap-1">
                          <span>
                            {appointment['start_time']
                              ? new Date(appointment['start_time']).toLocaleDateString()
                              : 'N/A'}
                          </span>
                          <Badge variant="outline">{statusLabel}</Badge>
                        </div>
                      </ItemActions>
                    </Item>
                    {index < metrics.recentActivity.length - 1 ? <ItemSeparator /> : null}
                  </Fragment>
                )
              })}
            </ItemGroup>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
