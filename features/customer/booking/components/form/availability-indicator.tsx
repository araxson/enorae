import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { AvailabilityStatus } from './use-booking-form'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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
      return <Spinner className="h-4 w-4" aria-hidden="true" />
    }
    if (status === 'available') {
      return <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
    }
    if (status === 'unavailable') {
      return <XCircle className="h-4 w-4" aria-hidden="true" />
    }
    return <AlertCircle className="h-4 w-4" aria-hidden="true" />
  }

  const statusLabel =
    status === 'available'
      ? 'Available'
      : status === 'unavailable'
        ? 'Unavailable'
        : status === 'checking'
          ? 'Checking availability'
          : 'Status unknown'

  return (
    <Alert variant={getVariant()}>
      {getIcon()}
      <AlertDescription>
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemContent>
              <ItemTitle>{statusLabel}</ItemTitle>
              <ItemDescription>
                {message ??
                  (status === 'checking'
                    ? 'Checking staff availability...'
                    : 'Unable to determine availability.')}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </AlertDescription>
    </Alert>
  )
}
