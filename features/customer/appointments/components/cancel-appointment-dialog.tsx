'use client'

import { useState } from 'react'
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

  const hoursUntil = (new Date(startTime).getTime() - Date.now()) / (1000 * 60 * 60)
  const canCancel = hoursUntil >= 24

  const handleCancel = async () => {
    setIsLoading(true)
    setError(null)

    const result = await cancelAppointment(appointmentId)

    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="destructive" className="flex-1">
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
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Cancellation unavailable</AlertTitle>
            <AlertDescription>
              Appointments must be cancelled at least 24 hours in advance. Please contact the salon
              directly to cancel this appointment.
            </AlertDescription>
          </Alert>
        )}

        {canCancel && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Cancellation policy</AlertTitle>
            <AlertDescription>
              Cancellation policy: Appointments must be cancelled at least 24 hours in advance.
              Hours remaining: {Math.floor(hoursUntil)}h {Math.floor((hoursUntil % 1) * 60)}m
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Cancellation failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Keep appointment
          </Button>
          {canCancel && (
            <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
              {isLoading ? 'Cancelling...' : 'Yes, cancel appointment'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
