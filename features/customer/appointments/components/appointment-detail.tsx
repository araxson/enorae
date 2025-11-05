import type { JSX } from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { getCustomerAppointmentById } from '@/features/customer/appointments/api/queries'
import { Check } from 'lucide-react'
import { AppointmentInfoSection } from './appointment-info-section'
import { AppointmentServiceCard } from './appointment-service-card'
import { AppointmentActionsSection } from './appointment-actions-section'

interface AppointmentDetailProps {
  appointmentId: string
}

const getStatusVariant = (status: string | null) => {
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

const formatStatusLabel = (status: string | null) =>
  status
    ? status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Pending'

export async function AppointmentDetail({ appointmentId }: AppointmentDetailProps): Promise<JSX.Element> {
  const appointment = await getCustomerAppointmentById(appointmentId)

  if (!appointment) {
    notFound()
  }

  const statusLabel = formatStatusLabel(appointment.status)

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <Check className="size-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Confirmation</ItemTitle>
              <ItemDescription>{appointment.confirmation_code || 'No code'}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant={getStatusVariant(appointment.status)}>{statusLabel}</Badge>
            </ItemActions>
          </Item>
        </ItemGroup>

        <Card>
          <CardHeader>
            <CardTitle>Appointment overview</CardTitle>
            <CardDescription>Schedule, team, and services for this visit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <AppointmentInfoSection
                startTime={appointment.start_time}
                endTime={appointment.end_time}
                durationMinutes={appointment.duration_minutes}
                staffName={appointment.staff_name}
              />

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Service</p>
                <AppointmentServiceCard
                  serviceName={appointment.service_name}
                  durationMinutes={appointment.duration_minutes}
                  totalPrice={appointment.total_price}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <AppointmentActionsSection
          appointmentId={appointment.id}
          status={appointment.status}
          startTime={appointment.start_time}
        />
      </div>
    </div>
  )
}
