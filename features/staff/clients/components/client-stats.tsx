'use client'

import { Card, CardHeader } from '@/components/ui/card'
import { Users, UserCheck, Calendar, DollarSign } from 'lucide-react'
import type { ClientWithHistory } from '@/features/staff/clients/api/queries'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
      label: 'Total Clients',
      value: totalClients.toString(),
      icon: Users,
      color: 'text-secondary',
    },
    {
      label: 'Repeat Clients',
      value: repeatClients.toString(),
      icon: UserCheck,
      color: 'text-primary',
    },
    {
      label: 'Appointments',
      value: totalAppointments.toString(),
      icon: Calendar,
      color: 'text-accent',
    },
    {
      label: 'Total Revenue',
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
            <CardHeader>
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <Icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{stat.value}</ItemTitle>
                  <ItemDescription>{stat.label}</ItemDescription>
                </ItemContent>
              </Item>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
