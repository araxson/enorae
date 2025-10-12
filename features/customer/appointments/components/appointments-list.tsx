'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { H3, P, Muted } from '@/components/ui/typography'
import { EmptyState } from '@/components/shared/empty-state'
import { CalendarX } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']

interface AppointmentsListProps {
  appointments: Appointment[]
}

const statusVariant = (status: Appointment['status']) => {
  switch (status) {
    case 'completed':
    case 'confirmed':
      return 'default' as const
    case 'cancelled':
      return 'destructive' as const
    default:
      return 'secondary' as const
  }
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title="No appointments yet"
        description="Book your first appointment at a salon"
        action={
          <Button asChild>
            <Link href="/customer/salons">Browse salons</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="p-6">
          <div className="flex h-full flex-col gap-4">
            <div className="space-y-1">
              <H3>{appointment.salon_name || 'Unnamed Salon'}</H3>
              <Muted>{appointment.service_names || 'Service'}</Muted>
            </div>

            <div className="space-y-1">
              <P className="text-sm">
                {appointment.start_time &&
                  new Date(appointment.start_time).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
              </P>
              <P className="text-sm text-muted-foreground">
                {appointment.start_time &&
                  new Date(appointment.start_time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </P>
            </div>

            <Badge variant={statusVariant(appointment.status)} className="w-fit capitalize">
              {appointment.status}
            </Badge>

            <Button asChild variant="outline" className="mt-auto w-full">
              <Link href={`/customer/appointments/${appointment.id}`}>
                View details
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
