import { Separator } from '@/components/ui/separator'
import { Clock } from 'lucide-react'
import type { AppointmentDetailContentProps } from './types'

export function DateTimeSection({ appointment }: Pick<AppointmentDetailContentProps, 'appointment'>) {
  if (!appointment) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <span className="text-base text-foreground">Date &amp; time</span>
        <p className="text-sm text-foreground">
          {appointment.start_time &&
            new Date(appointment.start_time).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
        </p>
        <p className="text-sm text-muted-foreground">
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
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {appointment.duration_minutes || 0} minutes total
          </span>
        </div>
      </div>

      {appointment.staff_name && (
        <>
          <Separator />
          <div className="space-y-1">
            <span className="text-base text-foreground">Staff member</span>
            <p className="text-sm text-foreground">{appointment.staff_name}</p>
          </div>
        </>
      )}
    </div>
  )
}
