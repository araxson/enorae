'use client'

import { Fragment } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Calendar, CheckCircle2, XCircle, TrendingUp } from 'lucide-react'
import type { CustomerMetrics } from '@/features/customer/analytics/api/queries'
import { Separator } from '@/components/ui/separator'

interface MetricsDashboardProps {
  metrics: CustomerMetrics
}

export function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  const stats = [
    {
      title: 'Total Spending',
      value: `$${metrics.totalSpending.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-primary',
      description: 'Total amount spent',
    },
    {
      title: 'Total Appointments',
      value: metrics.totalAppointments.toString(),
      icon: Calendar,
      color: 'text-secondary',
      description: 'All appointments booked',
    },
    {
      title: 'Completed',
      value: metrics.completedAppointments.toString(),
      icon: CheckCircle2,
      color: 'text-primary',
      description: 'Completed visits',
    },
    {
      title: 'Cancelled',
      value: metrics.cancelledAppointments.toString(),
      icon: XCircle,
      color: 'text-destructive',
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
              <CardHeader className="flex items-start justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle>{stat['title']}</CardTitle>
                  <CardDescription>{stat['description']}</CardDescription>
                </div>
                <Icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Favorite Services */}
      {metrics.favoriteServices.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>Favorite services</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              {metrics.favoriteServices.map((service, index) => (
                <Fragment key={`${service.service}-${index}`}>
                  <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium text-foreground">{service.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.count} {service.count === 1 ? 'booking' : 'bookings'}
                    </p>
                  </div>
                  {index < metrics.favoriteServices.length - 1 ? <Separator /> : null}
                </Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {metrics.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest customer appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              {metrics.recentActivity.map((appointment, index) => (
                <Fragment key={appointment['id']}>
                  <div className="flex items-start justify-between py-3 first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {appointment['service_name'] || 'Service'}
                      </p>
                      <p className="text-sm text-muted-foreground">{appointment['salon_name'] || 'Salon'}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-foreground">
                        {appointment['start_time'] ? new Date(appointment['start_time']).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-xs capitalize text-muted-foreground">{appointment['status']}</p>
                    </div>
                  </div>
                  {index < metrics.recentActivity.length - 1 ? <Separator /> : null}
                </Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
