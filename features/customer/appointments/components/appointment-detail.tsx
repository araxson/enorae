import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { H3, P, Muted } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCustomerAppointmentById, getAppointmentServices, getAppointmentProductUsage } from '../api/queries'
import { CancelAppointmentDialog } from './cancel-appointment-dialog'
import { RescheduleRequestDialog } from './reschedule-request-dialog'
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
  const [appointment, services, productUsage] = await Promise.all([
    getCustomerAppointmentById(appointmentId),
    getAppointmentServices(appointmentId),
    getAppointmentProductUsage(appointmentId),
  ])

  if (!appointment) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <AppointmentDetailContent appointment={appointment} services={services} productUsage={productUsage} />
    </div>
  )
}

function AppointmentDetailContent({
  appointment,
  services,
  productUsage,
}: {
  appointment: Awaited<ReturnType<typeof getCustomerAppointmentById>>
  services: Awaited<ReturnType<typeof getAppointmentServices>>
  productUsage: Awaited<ReturnType<typeof getAppointmentProductUsage>>
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
        <Muted>{appointment.confirmation_code || 'No code'}</Muted>
        <Badge variant={getStatusVariant(appointment.status)} className="capitalize">
          {appointment.status ?? 'pending'}
        </Badge>
      </div>

      <Separator />

      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="space-y-2">
            <H3>Date &amp; time</H3>
            <P>
              {appointment.start_time &&
                new Date(appointment.start_time).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </P>
            <P className="text-muted-foreground">
              {appointment.start_time &&
                new Date(appointment.start_time).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              {' — '}
              {appointment.end_time &&
                new Date(appointment.end_time).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
            </P>
            <div className="mt-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Muted>{appointment.duration_minutes || 0} minutes total</Muted>
            </div>
          </div>

          {appointment.staff_name && (
            <>
              <Separator />
              <div className="space-y-1">
                <H3>Staff member</H3>
                <P>{appointment.staff_name}</P>
                {appointment.staff_title && <Muted>{appointment.staff_title}</Muted>}
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-4">
            <H3>Services</H3>
            {services.length > 0 ? (
              <div className="overflow-hidden rounded-md border">
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
                          <div className="space-y-1">
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
              <P className="text-muted-foreground">
                {appointment.service_names || 'No services listed'}
              </P>
            )}
          </div>
        </CardContent>
      </Card>

      {productUsage.length > 0 && (
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-4">
              <H3>Products Used</H3>
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productUsage.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <P className="font-medium">{product.product_name || 'Unknown Product'}</P>
                            {product.product_description && (
                              <Muted className="text-xs">{product.product_description}</Muted>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm">
                            {product.quantity_used} {product.unit_of_measure || 'unit(s)'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(product.cost_at_time)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Muted className="text-xs">
                These are professional products used during your appointment.
              </Muted>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/customer/appointments">Back to appointments</Link>
        </Button>
        {appointment.status === 'confirmed' && appointment.start_time && appointment.id && (
          <>
            <RescheduleRequestDialog
              appointmentId={appointment.id}
              currentStartTime={appointment.start_time}
            />
            <CancelAppointmentDialog
              appointmentId={appointment.id}
              startTime={appointment.start_time}
            />
          </>
        )}
      </div>
    </div>
  )
}
