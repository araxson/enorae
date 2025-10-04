import { Clock, User, Building2 } from 'lucide-react'
import { P, Muted } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import type { Database } from '@/lib/types/database.types'

type AdminAppointment = Database['public']['Views']['admin_appointments_overview']['Row']

interface AppointmentsListProps {
  appointments: AdminAppointment[]
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <P className="text-center text-muted-foreground py-8">No appointments found</P>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <P className="font-medium">{appointment.salon_name}</P>
                  <Badge variant={
                    appointment.status === 'completed' ? 'default' :
                    appointment.status === 'cancelled' ? 'destructive' :
                    appointment.status === 'no_show' ? 'outline' :
                    'secondary'
                  }>
                    {appointment.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{appointment.customer_name || 'Walk-in'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{appointment.duration_minutes} min</span>
                  </div>
                  {appointment.service_count && appointment.service_count > 0 && (
                    <span>{appointment.service_count} service(s)</span>
                  )}
                </div>

                {appointment.staff_name && (
                  <Muted className="text-sm">
                    Staff: {appointment.staff_name} {appointment.staff_title && `(${appointment.staff_title})`}
                  </Muted>
                )}
              </div>

              <div className="text-right space-y-1">
                <P className="text-sm font-medium">
                  {appointment.start_time ? format(new Date(appointment.start_time), 'MMM dd, yyyy') : 'N/A'}
                </P>
                <Muted className="text-sm">
                  {appointment.start_time ? format(new Date(appointment.start_time), 'h:mm a') : 'N/A'}
                </Muted>
                {appointment.confirmation_code && (
                  <Muted className="text-xs">#{appointment.confirmation_code}</Muted>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
