'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Flex } from '@/components/layout'
import { P } from '@/components/ui/typography'
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
      color: 'text-blue-500',
    },
    {
      label: 'Completed',
      value: completedAppointments.toString(),
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      label: 'Hours',
      value: totalHours,
      icon: Clock,
      color: 'text-orange-500',
    },
    {
      label: 'Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-500',
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
                  <P className="text-sm text-muted-foreground">{stat.label}</P>
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
