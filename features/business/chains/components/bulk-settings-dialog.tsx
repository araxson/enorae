'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { updateChainSettings } from '@/features/business/chains/api/mutations'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

type BulkSettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  chainId: string
  chainName: string
  locationCount: number
}

export function BulkSettingsDialog({
  open,
  onOpenChange,
  chainId,
  chainName,
  locationCount,
}: BulkSettingsDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAcceptingBookings, setIsAcceptingBookings] = useState(true)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append('chainId', chainId)
    formData.append('isAcceptingBookings', String(isAcceptingBookings))

    try {
      const result = await updateChainSettings(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(
          `Settings updated for ${result.updatedCount} location(s)`
        )
        onOpenChange(false)
        router.refresh()
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Update Settings</DialogTitle>
          <DialogDescription>
            Update settings for all {locationCount} location(s) in {chainName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="bookingLeadTimeHours">
                  Booking Lead Time (hours)
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="bookingLeadTimeHours"
                    name="bookingLeadTimeHours"
                    type="number"
                    min="0"
                    placeholder="e.g., 24"
                  />
                  <FieldDescription>
                    Minimum hours in advance customers must book
                  </FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="cancellationHours">
                  Cancellation Policy (hours)
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="cancellationHours"
                    name="cancellationHours"
                    type="number"
                    min="0"
                    placeholder="e.g., 48"
                  />
                  <FieldDescription>
                    Hours before appointment when cancellation is allowed
                  </FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="isAcceptingBookings">Accept Bookings</FieldLabel>
                <FieldContent>
                  <div className="flex items-center justify-between">
                    <FieldDescription>Allow new bookings at all locations</FieldDescription>
                    <Switch
                      id="isAcceptingBookings"
                      checked={isAcceptingBookings}
                      onCheckedChange={setIsAcceptingBookings}
                    />
                  </div>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="mt-6">
            <ButtonGroup>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update All Locations'}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
