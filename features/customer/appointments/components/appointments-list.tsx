'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{appointment.salon_name || 'Unnamed Salon'}</h3>
              <p className="text-sm text-muted-foreground">{appointment.service_names || 'Service'}</p>
            </div>

            <div className="space-y-1">
              <p className="leading-7 text-sm">
                {appointment.start_time &&
                  new Date(appointment.start_time).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
              </p>
              <p className="leading-7 text-sm text-muted-foreground">
                {appointment.start_time &&
                  new Date(appointment.start_time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </p>
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
