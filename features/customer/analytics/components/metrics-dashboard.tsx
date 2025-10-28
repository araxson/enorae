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
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyContent,
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card key={stat['title']}>
              <CardHeader className="space-y-3">
                <ItemGroup>
                  <Item variant="muted" size="sm">
                    <ItemMedia variant="icon">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{stat['title']}</ItemTitle>
                    <ItemDescription>{stat['description']}</ItemDescription>
                  </ItemContent>
                  </Item>
                </ItemGroup>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemMedia variant="icon">
                <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Favorite services</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          {metrics.favoriteServices.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <TrendingUp className="h-6 w-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyHeader>
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
                    <ItemActions className="flex-none">
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
          <ItemGroup>
            <Item className="flex-col items-start gap-1">
              <ItemContent>
                <ItemTitle>Recent activity</ItemTitle>
              </ItemContent>
              <ItemContent>
                <ItemDescription>Latest customer appointments</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          {metrics.recentActivity.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <Calendar className="h-6 w-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyHeader>
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
                      <ItemActions className="flex-none flex-col items-end gap-1">
                        <span>
                          {appointment['start_time']
                            ? new Date(appointment['start_time']).toLocaleDateString()
                            : 'N/A'}
                        </span>
                        <Badge variant="outline">{statusLabel}</Badge>
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
