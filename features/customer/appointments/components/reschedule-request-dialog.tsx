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
import { Calendar } from 'lucide-react'
import { requestReschedule } from '@/features/customer/appointments/api/mutations'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { RescheduleFormFields } from './reschedule-form-fields'
import { RescheduleAlerts } from './reschedule-alerts'

interface RescheduleRequestDialogProps {
  appointmentId: string
  currentStartTime: string
  children?: React.ReactNode
}

export function RescheduleRequestDialog({
  appointmentId,
  currentStartTime,
  children,
}: RescheduleRequestDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await requestReschedule(appointmentId, formData)

    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  const minDateTime = new Date()
  minDateTime.setHours(minDateTime.getHours() + 24) // Minimum 24 hours from now

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full">
            <Calendar className="mr-2 size-4" />
            Request reschedule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request reschedule</DialogTitle>
            <DialogDescription>
              Request to reschedule your appointment. The salon will review and confirm the new
              time.
            </DialogDescription>
          </DialogHeader>

          <RescheduleFormFields
            currentStartTime={currentStartTime}
            minDateTime={minDateTime}
          />

          <RescheduleAlerts error={error} />

          <DialogFooter>
            <ButtonGroup aria-label="Dialog actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Sending request</span>
                  </>
                ) : (
                  <span>Send request</span>
                )}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
