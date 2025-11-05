'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarX, Clock } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type Appointment = Database['public']['Views']['admin_appointments_overview_view']['Row']

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
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarX className="size-5" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No appointments yet</EmptyTitle>
          <EmptyDescription>Book your first appointment at a salon.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/customer/salons">Browse salons</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {appointments.map((appointment) => {
        const startTime = appointment['start_time'] ? new Date(appointment['start_time']) : null
        const formattedDate = startTime
          ? startTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : null
        const formattedTime = startTime
          ? startTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : null

        const statusLabel = formatStatus(appointment['status'] ?? 'pending')
        const statusVariantValue = statusVariant(appointment['status'] ?? 'pending')

        return (
          <Item key={appointment['id']} variant="outline">
            <ItemHeader>
              <ItemTitle>{appointment['salon_name'] || 'Unnamed Salon'}</ItemTitle>
              <ItemDescription>{appointment['service_name'] || 'Service'}</ItemDescription>
            </ItemHeader>
            <ItemContent>
              {startTime ? (
                <>
                  {formattedDate ? (
                    <ItemDescription>
                      <Clock className="inline size-3" aria-hidden="true" />{' '}
                      <time dateTime={appointment['start_time'] ?? undefined}>{formattedDate}</time>
                    </ItemDescription>
                  ) : null}
                  {formattedTime ? (
                    <ItemDescription>
                      <time dateTime={appointment['start_time'] ?? undefined}>{formattedTime}</time>
                    </ItemDescription>
                  ) : null}
                </>
              ) : null}
            </ItemContent>
            <ItemFooter>
              <Badge variant={statusVariantValue}>{statusLabel}</Badge>
              <Button asChild variant="outline" size="sm">
                <Link href={`/customer/appointments/${appointment['id']}`}>View details</Link>
              </Button>
            </ItemFooter>
          </Item>
        )
      })}
    </div>
  )
}
