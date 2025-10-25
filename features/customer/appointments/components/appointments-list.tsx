'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/features/shared/ui-components'
import { CalendarX } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments_view']['Row']

type AppointmentStatus = NonNullable<Appointment['status']>

interface AppointmentsListProps {
  appointments: Appointment[]
}

const statusVariant = (status: AppointmentStatus | 'pending') => {
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

const formatStatus = (status: AppointmentStatus | 'pending') =>
  status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

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
        <Card key={appointment['id']}>
          <CardHeader className="p-6 pb-4">
            <CardTitle>{appointment['salon_name'] || 'Unnamed Salon'}</CardTitle>
            <CardDescription>{appointment['service_names'] || 'Service'}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-3">
            <div className="space-y-1">
              <p className="text-sm">
                {appointment['start_time'] &&
                  new Date(appointment['start_time']).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
              </p>
              <p className="text-sm text-muted-foreground">
                {appointment['start_time'] &&
                  new Date(appointment['start_time']).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </p>
            </div>

            <div>
              <Badge variant={statusVariant(appointment['status'] ?? 'pending')}>
                {formatStatus(appointment['status'] ?? 'pending')}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button asChild variant="outline" className="w-full">
              <Link href={`/customer/appointments/${appointment['id']}`}>
                View details
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
