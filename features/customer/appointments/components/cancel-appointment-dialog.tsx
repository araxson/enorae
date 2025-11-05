'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { cancelAppointment } from '@/features/customer/appointments/api/mutations'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { logError } from '@/lib/observability'

interface CancelAppointmentDialogProps {
  appointmentId: string
  startTime: string
  children?: React.ReactNode
}

export function CancelAppointmentDialog({
  appointmentId,
  startTime,
  children,
}: CancelAppointmentDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { hoursUntil, canCancel, remainingHours, remainingMinutes } = useMemo(() => {
    const hours = (new Date(startTime).getTime() - Date.now()) / (1000 * 60 * 60)
    return {
      hoursUntil: hours,
      canCancel: hours >= 24,
      remainingHours: Math.max(0, Math.floor(hours)),
      remainingMinutes: Math.max(0, Math.floor((hours % 1) * 60)),
    }
  }, [startTime])

  const handleCancel = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await cancelAppointment(appointmentId)

      if (result.success) {
        setOpen(false)
        router.refresh()
      } else {
        setError(result.error)
      }
    } catch (error) {
      logError('Error cancelling appointment', { error: error instanceof Error ? error : new Error(String(error)), operationName: 'CancelAppointmentDialog', appointmentId })
      setError(error instanceof Error ? error.message : 'Failed to cancel appointment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [appointmentId, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="destructive">
            Cancel appointment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel appointment</DialogTitle>
          <DialogDescription>
            {canCancel
              ? 'Are you sure you want to cancel this appointment? This action cannot be undone.'
              : 'This appointment cannot be cancelled online.'}
          </DialogDescription>
        </DialogHeader>

        {!canCancel && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Cancellation unavailable</AlertTitle>
            <AlertDescription>
              Appointments must be cancelled at least 24 hours in advance. Please contact the salon
              directly to cancel this appointment.
            </AlertDescription>
          </Alert>
        )}

        {canCancel && (
          <Alert>
            <AlertCircle className="size-4" />
            <AlertTitle>Cancellation policy</AlertTitle>
            <AlertDescription>
              Cancellation policy: Appointments must be cancelled at least 24 hours in advance.
              <ItemGroup className="mt-3 gap-2">
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <ItemTitle>Hours remaining</ItemTitle>
                    <ItemDescription>{remainingHours} hours</ItemDescription>
                  </ItemContent>
                </Item>
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <ItemTitle>Minutes remaining</ItemTitle>
                    <ItemDescription>{remainingMinutes} minutes</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Cancellation failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <ButtonGroup aria-label="Dialog actions">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Keep appointment
            </Button>
            {canCancel ? (
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Cancelling</span>
                  </>
                ) : (
                  <span>Yes, cancel appointment</span>
                )}
              </Button>
            ) : null}
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
