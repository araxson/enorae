import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
import { Clock, DollarSign } from 'lucide-react'

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{appointment['confirmation_code'] || 'No code'}</p>
        <Badge variant={getStatusVariant(appointment['status'])}>
          {appointment['status'] ?? 'pending'}
        </Badge>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Appointment overview</CardTitle>
          <CardDescription>Schedule, team, and services for this visit</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Date &amp; time</p>
            <p className="leading-7">
              {appointment['start_time'] &&
                new Date(appointment['start_time']).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </p>
            <p className="leading-7 text-muted-foreground">
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
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{appointment['duration_minutes'] || 0} minutes total</p>
            </div>
          </div>

          {appointment['staff_name'] && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Staff member</p>
                <p className="leading-7">{appointment['staff_name']}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Service</p>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="leading-7">{appointment['service_name'] || 'No service specified'}</p>
                  </div>
                  {appointment['duration_minutes'] && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{appointment['duration_minutes']} minutes</span>
                    </div>
                  )}
                  {appointment['total_price'] !== null && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-lg font-semibold">{formatCurrency(appointment['total_price'])}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/customer/appointments">Back to appointments</Link>
        </Button>
        {appointment['status'] === 'confirmed' && appointment['start_time'] && appointment['id'] && (
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
        )}
      </div>
    </div>
  )
}
