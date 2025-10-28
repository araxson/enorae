'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, CheckCircle, History } from 'lucide-react'
import type { StaffAppointment } from '@/features/staff/appointments/api/queries'

type AppointmentStatsProps = {
  appointments: StaffAppointment[]
}

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter((a) => a['status'] === 'completed').length
  const totalMinutes = appointments.reduce((acc, a) => acc + (a['duration_minutes'] || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)
  const pendingAppointments = appointments.filter((a) => a['status'] === 'pending').length

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
      label: 'Pending',
      value: pendingAppointments.toString(),
      icon: History,
      color: 'text-muted-foreground',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-muted p-2">
                  <Icon className={`size-4 ${stat.color}`} aria-hidden />
                </span>
                <div className="space-y-1">
                  <CardTitle>{stat.value}</CardTitle>
                  <CardDescription>{stat.label}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
