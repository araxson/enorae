import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
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

  const getVariant = () => {
    if (status === 'available') return 'default'
    if (status === 'unavailable') return 'destructive'
    return 'default'
  }

  const getIcon = () => {
    if (status === 'checking' || isCheckingAvailability) {
      return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    }
    if (status === 'available') {
      return <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
    }
    if (status === 'unavailable') {
      return <XCircle className="h-4 w-4" aria-hidden="true" />
    }
    return <AlertCircle className="h-4 w-4" aria-hidden="true" />
  }

  return (
    <Alert variant={getVariant()}>
      {getIcon()}
      <AlertDescription>
        {message ??
          (status === 'checking'
            ? 'Checking staff availability...'
            : 'Unable to determine availability.')}
      </AlertDescription>
    </Alert>
  )
}
