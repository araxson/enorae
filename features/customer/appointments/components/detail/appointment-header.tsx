import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getStatusVariant } from './utils'
import type { AppointmentDetailContentProps } from './types'

export function AppointmentHeader({ appointment }: Pick<AppointmentDetailContentProps, 'appointment'>) {
  if (!appointment) return null
  const statusLabel = (appointment['status'] ?? 'pending')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          {appointment['confirmation_code'] || 'No code'}
        </span>
        <Badge variant={getStatusVariant(appointment['status'])}>{statusLabel}</Badge>
      </div>
      <Separator />
    </>
  )
}
