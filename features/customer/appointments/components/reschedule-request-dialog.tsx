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
import { AlertCircle, Calendar } from 'lucide-react'
import { requestReschedule } from '@/features/customer/appointments/api/mutations'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { ButtonGroup } from '@/components/ui/button-group'

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

  // Format current time for display
  const currentDate = new Date(currentStartTime)
  const minDateTime = new Date()
  minDateTime.setHours(minDateTime.getHours() + 24) // Minimum 24 hours from now

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full">
            <Calendar className="mr-2 h-4 w-4" />
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

          <FieldSet className="py-4">
            <FieldLegend>Request details</FieldLegend>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="current-time">Current appointment</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="current-time"
                      value={currentDate.toLocaleString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      disabled
                    />
                  </InputGroup>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="newStartTime">Requested new time *</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="newStartTime"
                      name="newStartTime"
                      type="datetime-local"
                      min={minDateTime.toISOString().slice(0, 16)}
                      required
                      aria-describedby="new-start-time-help"
                    />
                  </InputGroup>
                  <p id="new-start-time-help" className="text-xs text-muted-foreground">
                    Must be at least 24 hours from now
                  </p>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="reason">Reason (optional)</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupTextarea
                      id="reason"
                      name="reason"
                      placeholder="Let the salon know why you need to reschedule..."
                      rows={3}
                    />
                  </InputGroup>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Reschedule request</AlertTitle>
              <AlertDescription>
                Your reschedule request will be sent to the salon for approval. You&apos;ll be
                notified once they respond.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Submission failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <ButtonGroup className="w-full justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending request...' : 'Send request'}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
