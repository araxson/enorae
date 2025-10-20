import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import type { AvailabilityStatus } from './use-booking-form'

interface AvailabilityIndicatorProps {
  status: AvailabilityStatus
  message: string | null
  isCheckingAvailability: boolean
}

export function AvailabilityIndicator({
  status,
  message,
  isCheckingAvailability,
}: AvailabilityIndicatorProps) {
  if (status === 'idle') return null

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === 'checking' || isCheckingAvailability ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : status === 'available' ? (
        <CheckCircle2 className="h-4 w-4 text-success" />
      ) : status === 'unavailable' ? (
        <XCircle className="h-4 w-4 text-destructive" />
      ) : (
        <AlertCircle className="h-4 w-4 text-destructive" />
      )}
      <span
        className={
          status === 'available'
            ? 'text-success'
            : status === 'unavailable'
            ? 'text-destructive'
            : 'text-muted-foreground'
        }
      >
        {message ??
          (status === 'checking'
            ? 'Checking staff availability...'
            : 'Unable to determine availability.')}
      </span>
    </div>
  )
}
