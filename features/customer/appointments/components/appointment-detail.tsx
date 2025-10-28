import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCustomerAppointmentById } from '@/features/customer/appointments/api/queries'
import { CancelAppointmentDialog } from '@/features/customer/appointments/components/cancel-appointment-dialog'
import { RescheduleRequestDialog } from '@/features/customer/appointments/components/reschedule-request-dialog'
import { Check, Clock, DollarSign } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'

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

export async function AppointmentDetail({ appointmentId }: AppointmentDetailProps) {
  const appointment = await getCustomerAppointmentById(appointmentId)

  if (!appointment) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <AppointmentDetailContent appointment={appointment} />
    </div>
  )
}

function AppointmentDetailContent({
  appointment,
}: {
  appointment: Awaited<ReturnType<typeof getCustomerAppointmentById>>
}) {
  if (!appointment) return null

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const statusLabel = formatStatusLabel(appointment['status'])

  return (
    <div className="space-y-8">
      <ItemGroup>
        <Item>
          <ItemMedia variant="icon">
            <Check className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Confirmation</ItemTitle>
            <ItemDescription>{appointment['confirmation_code'] || 'No code'}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant={getStatusVariant(appointment['status'])}>{statusLabel}</Badge>
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
            <ItemGroup className="gap-4">
              <Item variant="outline" size="sm">
                <ItemContent>
                  <ItemDescription>Date &amp; time</ItemDescription>
                  <ItemTitle>
                    {appointment['start_time'] &&
                      new Date(appointment['start_time']).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                  </ItemTitle>
                  <ItemDescription>
                    {appointment['start_time'] &&
                      new Date(appointment['start_time']).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    {' — '}
                    {appointment['end_time'] &&
                      new Date(appointment['end_time']).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    <span>{appointment['duration_minutes'] || 0} minutes total</span>
                  </div>
                </ItemActions>
              </Item>

              {appointment['staff_name'] ? (
                <Item variant="outline" size="sm">
                  <ItemContent>
                    <ItemDescription>Staff member</ItemDescription>
                    <ItemTitle>{appointment['staff_name']}</ItemTitle>
                  </ItemContent>
                </Item>
              ) : null}
            </ItemGroup>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Service</p>
              <Card>
                <CardContent className="pt-6">
                  <ItemGroup className="gap-4">
                    <Item>
                      <ItemContent>
                        <ItemTitle>
                          {appointment['service_name'] || 'No service specified'}
                        </ItemTitle>
                      </ItemContent>
                    </Item>
                    {appointment['duration_minutes'] ? (
                      <Item>
                        <ItemMedia variant="icon">
                          <Clock className="size-4" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemDescription>{appointment['duration_minutes']} minutes</ItemDescription>
                        </ItemContent>
                      </Item>
                    ) : null}
                    {appointment['total_price'] !== null ? (
                      <Item>
                        <ItemMedia variant="icon">
                          <DollarSign className="size-4" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{formatCurrency(appointment['total_price'])}</ItemTitle>
                        </ItemContent>
                      </Item>
                    ) : null}
                  </ItemGroup>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <ButtonGroup aria-label="Actions" orientation="horizontal">
        <div className="w-full sm:flex-1">
          <Button asChild variant="outline">
            <Link href="/customer/appointments">Back to appointments</Link>
          </Button>
        </div>
        {appointment['status'] === 'confirmed' && appointment['start_time'] && appointment['id'] ? (
          <>
            <RescheduleRequestDialog
              appointmentId={appointment['id']}
              currentStartTime={appointment['start_time']}
            />
            <CancelAppointmentDialog
              appointmentId={appointment['id']}
              startTime={appointment['start_time']}
            />
          </>
        ) : null}
      </ButtonGroup>
    </div>
  )
}
