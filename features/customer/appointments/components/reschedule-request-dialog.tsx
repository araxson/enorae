'use client'

import { useState, useActionState } from 'react'
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
  const [open, setOpen] = useState(false)

  // Server Action wrapper for useActionState
  type RescheduleFormState = { success: boolean; error: string | null }

  const rescheduleAction = async (prevState: RescheduleFormState, formData: FormData): Promise<RescheduleFormState> => {
    const result = await requestReschedule(appointmentId, formData)

    if (result.success) {
      setOpen(false)
      return { success: true, error: null }
    }

    return { success: false, error: result.error || 'Failed to request reschedule' }
  }

  const [state, formAction, isPending] = useActionState(rescheduleAction, { success: false, error: null })

  const minDateTime = new Date()
  minDateTime.setHours(minDateTime.getHours() + 24) // Minimum 24 hours from now

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <Calendar className="size-4" />
            Request reschedule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form action={formAction} noValidate>
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

          <RescheduleAlerts error={state?.error} />

          <DialogFooter>
            <ButtonGroup aria-label="Dialog actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} aria-busy={isPending}>
                {isPending ? (
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
