'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Flex } from '@/components/layout'
import { Calendar, Clock, DollarSign, CheckCircle } from 'lucide-react'
import type { StaffAppointment } from '../api/queries'

type AppointmentStatsProps = {
  appointments: StaffAppointment[]
}

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter((a) => a.status === 'completed').length
  const totalMinutes = appointments.reduce((acc, a) => acc + (a.duration_minutes || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)
  const totalRevenue = appointments.reduce((acc, a) => acc + (a.total_price || 0), 0)

  const stats = [
    {
      label: 'Total',
      value: totalAppointments.toString(),
      icon: Calendar,
      color: 'text-info',
    },
    {
      label: 'Completed',
      value: completedAppointments.toString(),
      icon: CheckCircle,
      color: 'text-success',
    },
    {
      label: 'Hours',
      value: totalHours,
      icon: Clock,
      color: 'text-warning',
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
            <CardContent className="p-4">
              <Flex justify="between" align="start">
                <div>
                  <p className="leading-7 text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </Flex>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
