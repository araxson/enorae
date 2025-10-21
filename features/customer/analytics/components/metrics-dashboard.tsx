'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Calendar, CheckCircle2, XCircle, TrendingUp } from 'lucide-react'
import type { CustomerMetrics } from '../api/queries'

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
    },
    {
      title: 'Total Appointments',
      value: metrics.totalAppointments.toString(),
      icon: Calendar,
      color: 'text-secondary',
    },
    {
      title: 'Completed',
      value: metrics.completedAppointments.toString(),
      icon: CheckCircle2,
      color: 'text-primary',
    },
    {
      title: 'Cancelled',
      value: metrics.cancelledAppointments.toString(),
      icon: XCircle,
      color: 'text-destructive',
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex items-start justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle>{stat.value}</CardTitle>
                  <CardDescription>{stat.title}</CardDescription>
                </div>
                <Icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {/* Favorite Services */}
      {metrics.favoriteServices.length > 0 && (
        <Card>
          <CardHeader className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
            <CardTitle>Favorite services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.favoriteServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between border-b py-2 last:border-0">
                <p className="text-sm font-medium text-foreground">{service.service}</p>
                <p className="text-sm text-muted-foreground">
                  {service.count} {service.count === 1 ? 'booking' : 'bookings'}
                </p>
              </div>
            ))}
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
          <CardContent className="space-y-3">
            {metrics.recentActivity.map((appointment) => (
              <div key={appointment.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {Array.isArray(appointment.service_names) && appointment.service_names.length > 0
                      ? appointment.service_names.join(', ')
                      : 'Service'}
                  </p>
                  <p className="text-sm text-muted-foreground">{appointment.salon_name || 'Salon'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">
                    {appointment.start_time ? new Date(appointment.start_time).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{appointment.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
