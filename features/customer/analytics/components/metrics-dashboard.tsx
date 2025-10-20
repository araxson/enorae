'use client'

import { Card } from '@/components/ui/card'
import { Grid, Stack, Box } from '@/components/layout'
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
      color: 'text-emerald-600',
    },
    {
      title: 'Total Appointments',
      value: metrics.totalAppointments.toString(),
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: metrics.completedAppointments.toString(),
      icon: CheckCircle2,
      color: 'text-green-600',
    },
    {
      title: 'Cancelled',
      value: metrics.cancelledAppointments.toString(),
      icon: XCircle,
      color: 'text-red-600',
    },
  ]

  return (
    <Stack gap="xl">
      {/* Stats Cards */}
      <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="lg">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6">
              <Stack gap="sm">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-muted-foreground text-sm">{stat.title}</p>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="leading-7 text-3xl font-bold">{stat.value}</p>
              </Stack>
            </Card>
          )
        })}
      </Grid>

      {/* Favorite Services */}
      {metrics.favoriteServices.length > 0 && (
        <Card className="p-6">
          <Stack gap="md">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Favorite Services</h3>
            </div>
            <Stack gap="sm">
              {metrics.favoriteServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <p className="leading-7">{service.service}</p>
                  <p className="text-sm text-muted-foreground">{service.count} {service.count === 1 ? 'booking' : 'bookings'}</p>
                </div>
              ))}
            </Stack>
          </Stack>
        </Card>
      )}

      {/* Recent Activity */}
      {metrics.recentActivity.length > 0 && (
        <Card className="p-6">
          <Stack gap="md">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Recent Activity</h3>
            <Stack gap="sm">
              {metrics.recentActivity.map((appointment) => (
                <div key={appointment.id} className="flex justify-between items-start py-3 border-b last:border-0">
                  <Box>
                    <p className="leading-7 font-medium">
                      {Array.isArray(appointment.service_names) && appointment.service_names.length > 0
                        ? appointment.service_names.join(', ')
                        : 'Service'}
                    </p>
                    <p className="text-sm text-muted-foreground text-sm">{appointment.salon_name || 'Salon'}</p>
                  </Box>
                  <Box className="text-right">
                    <p className="leading-7 text-sm">
                      {appointment.start_time ? new Date(appointment.start_time).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground text-xs capitalize">{appointment.status}</p>
                  </Box>
                </div>
              ))}
            </Stack>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
