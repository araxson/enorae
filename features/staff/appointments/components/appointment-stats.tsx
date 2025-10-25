'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, DollarSign, CheckCircle } from 'lucide-react'
import type { StaffAppointment } from '@/features/staff/appointments/api/queries'

type AppointmentStatsProps = {
  appointments: StaffAppointment[]
}

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter((a) => a['status'] === 'completed').length
  const totalMinutes = appointments.reduce((acc, a) => acc + (a['duration_minutes'] || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)
  const totalRevenue = appointments.reduce((acc, a) => acc + (a['total_price'] || 0), 0)

  const stats = [
    {
      label: 'Total',
      value: totalAppointments.toString(),
      icon: Calendar,
      color: 'text-secondary',
    },
    {
      label: 'Completed',
      value: completedAppointments.toString(),
      icon: CheckCircle,
      color: 'text-primary',
    },
    {
      label: 'Hours',
      value: totalHours,
      icon: Clock,
      color: 'text-accent',
    },
    {
      label: 'Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-accent',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>{stat.value}</CardTitle>
                <CardDescription>{stat.label}</CardDescription>
              </div>
              <Icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
