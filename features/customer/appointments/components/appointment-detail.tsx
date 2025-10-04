import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Section, Stack, Flex } from '@/components/layout'
import { H2, H3, P, Muted } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCustomerAppointmentById, getAppointmentServices } from '../api/queries'
import { Clock, DollarSign } from 'lucide-react'

interface AppointmentDetailProps {
  appointmentId: string
}

export async function AppointmentDetail({ appointmentId }: AppointmentDetailProps) {
  const [appointment, services] = await Promise.all([
    getCustomerAppointmentById(appointmentId),
    getAppointmentServices(appointmentId),
  ])

  if (!appointment) {
    notFound()
  }

  return (
    <Section size="lg">
      <AppointmentDetailContent appointment={appointment} services={services} />
    </Section>
  )
}

function AppointmentDetailContent({
  appointment,
  services
}: {
  appointment: Awaited<ReturnType<typeof getCustomerAppointmentById>>
  services: Awaited<ReturnType<typeof getAppointmentServices>>
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
    <Stack gap="xl">
      <Flex justify="between" align="center">
        <div>
          <H2>{appointment.salon_name || 'Unnamed Salon'}</H2>
          <Muted>{appointment.confirmation_code || 'No code'}</Muted>
        </div>
        <Badge variant={
          appointment.status === 'completed' ? 'default' :
          appointment.status === 'confirmed' ? 'default' :
          appointment.status === 'cancelled' ? 'destructive' :
          'secondary'
        }>
          {appointment.status}
        </Badge>
      </Flex>

      <Separator />

      <Card className="p-6">
        <Stack gap="lg">
          <div>
            <H3>Date & Time</H3>
            <P>
              {appointment.start_time && new Date(appointment.start_time).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </P>
            <P className="text-muted-foreground">
              {appointment.start_time && new Date(appointment.start_time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })} - {appointment.end_time && new Date(appointment.end_time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </P>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Muted>{appointment.duration_minutes || 0} minutes total</Muted>
            </div>
          </div>

          {appointment.staff_name && (
            <>
              <Separator />
              <div>
                <H3>Staff Member</H3>
                <P>{appointment.staff_name}</P>
                {appointment.staff_title && <Muted>{appointment.staff_title}</Muted>}
              </div>
            </>
          )}

          <Separator />

          <div>
            <H3 className="mb-4">Services</H3>
            {services.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Duration</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div>
                            <P className="font-medium">{service.service_name}</P>
                            {service.category_name && (
                              <Muted className="text-xs">{service.category_name}</Muted>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{service.duration_minutes} min</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(service.sale_price || service.current_price)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {appointment.total_price !== null && (
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={2} className="text-right font-semibold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          <div className="flex items-center justify-end gap-2">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(appointment.total_price)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <P className="text-muted-foreground">{appointment.service_names || 'No services listed'}</P>
            )}
          </div>

        </Stack>
      </Card>

      <Flex gap="md">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/customer/appointments">Back to Appointments</Link>
        </Button>
        {appointment.status === 'confirmed' && (
          <Button variant="destructive" className="flex-1">
            Cancel Appointment
          </Button>
        )}
      </Flex>
    </Stack>
  )
}
