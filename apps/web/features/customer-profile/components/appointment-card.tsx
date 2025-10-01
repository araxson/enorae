'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@enorae/ui'
import { Button } from '@enorae/ui'
import { Badge } from '@enorae/ui'
import { cancelAppointment } from '../actions/appointment.actions'
import type { Appointment } from '../types/profile.types'

interface AppointmentCardProps {
  appointment: Appointment
  isPast?: boolean
}

export function AppointmentCard({ appointment, isPast }: AppointmentCardProps) {
  const startDate = appointment.start_time
    ? new Date(appointment.start_time)
    : null

  const statusVariant = {
    draft: 'secondary',
    pending: 'secondary',
    confirmed: 'default',
    checked_in: 'default',
    in_progress: 'default',
    completed: 'outline',
    cancelled: 'destructive',
    no_show: 'destructive',
    rescheduled: 'secondary',
  }[appointment.status || 'pending'] as 'default' | 'secondary' | 'destructive' | 'outline'

  const handleCancel = async () => {
    if (appointment.id && confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment(appointment.id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {startDate ? startDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : 'No date'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {startDate ? startDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }) : 'No time'}
            </p>
          </div>
          <Badge variant={statusVariant}>
            {appointment.status || 'pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {appointment.confirmation_code && (
            <p className="text-sm">
              <span className="font-medium">Confirmation:</span>{' '}
              {appointment.confirmation_code}
            </p>
          )}
          {appointment.duration_minutes && (
            <p className="text-sm text-muted-foreground">
              Duration: {appointment.duration_minutes} minutes
            </p>
          )}
          {!isPast && appointment.status !== 'cancelled' && (
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}