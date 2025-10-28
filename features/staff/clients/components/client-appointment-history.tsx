'use client'

import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@/lib/types/database.types'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

type Appointment = Database['public']['Views']['appointments_view']['Row']

type ClientAppointmentHistoryProps = {
  appointments: Appointment[]
  loading: boolean
}

export function ClientAppointmentHistory({
  appointments,
  loading,
}: ClientAppointmentHistoryProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Spinner className="size-4" />
        <span>Loading appointments…</span>
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Calendar className="h-8 w-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No appointments found</EmptyTitle>
          <EmptyDescription>This client has no appointment history yet.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ItemGroup className="gap-2">
      {appointments.map((apt) => {
        const serviceNames = 'Appointment'
        const startTime = apt['start_time']
          ? format(new Date(apt['start_time']), 'MMM dd, yyyy • h:mm a')
          : null

        return (
          <Item key={apt['id']} variant="outline" size="sm">
            <ItemContent>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={apt['status'] === 'completed' ? 'default' : 'outline'}>
                  {apt['status']}
                </Badge>
                {startTime ? (
                  <ItemDescription>{startTime}</ItemDescription>
                ) : null}
              </div>
              <ItemTitle>{serviceNames}</ItemTitle>
              {apt['duration_minutes'] ? (
                <ItemDescription>{apt['duration_minutes']} minutes</ItemDescription>
              ) : null}
            </ItemContent>
          </Item>
        )
      })}
    </ItemGroup>
  )
}
