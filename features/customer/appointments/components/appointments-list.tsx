'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stack, Grid } from '@/components/layout'
import { H3, P, Muted } from '@/components/ui/typography'
import { EmptyState } from '@/components/shared/empty-state'
import { CalendarX } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']

interface AppointmentsListProps {
  appointments: Appointment[]
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
            <Link href="/explore">Browse Salons</Link>
          </Button>
        }
      />
    )
  }

  return (
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="p-6">
          <Stack gap="md">
            <div>
              <H3>{appointment.salon_name || 'Unnamed Salon'}</H3>
              <Muted>{appointment.service_names || 'Service'}</Muted>
            </div>

            <div>
              <P className="text-sm">
                {appointment.start_time && new Date(appointment.start_time).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </P>
              <P className="text-sm text-muted-foreground">
                {appointment.start_time && new Date(appointment.start_time).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </P>
            </div>

            <Badge className="w-fit" variant={
              appointment.status === 'completed' ? 'default' :
              appointment.status === 'confirmed' ? 'default' :
              appointment.status === 'cancelled' ? 'destructive' :
              'secondary'
            }>
              {appointment.status}
            </Badge>

            <Button asChild variant="outline" className="w-full">
              <Link href={`/customer/appointments/${appointment.id}`}>
                View Details
              </Link>
            </Button>
          </Stack>
        </Card>
      ))}
    </Grid>
  )
}
