'use client'

import { Users, UserCheck, Calendar, DollarSign } from 'lucide-react'
import type { ClientWithHistory } from '@/features/staff/clients/api/queries'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

type ClientStatsProps = {
  clients: ClientWithHistory[]
}

export function ClientStats({ clients }: ClientStatsProps) {
  const totalClients = clients.length
  const repeatClients = clients.filter((c) => c.total_appointments > 1).length
  const totalAppointments = clients.reduce((acc, c) => acc + c.total_appointments, 0)
  const totalRevenue = clients.reduce((acc, c) => acc + (c.total_revenue || 0), 0)

  const stats = [
    {
      label: 'Total clients',
      value: totalClients.toString(),
      icon: Users,
      helper: 'Across your entire book',
    },
    {
      label: 'Repeat clients',
      value: repeatClients.toString(),
      icon: UserCheck,
      helper: 'Booked more than once',
    },
    {
      label: 'Appointments',
      value: totalAppointments.toString(),
      icon: Calendar,
      helper: 'All-time completed visits',
    },
    {
      label: 'Total revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      helper: 'Lifetime value across clients',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
              <CardDescription>{stat.helper}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold leading-none">{stat.value}</div>
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
