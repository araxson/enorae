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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { updateChainSettings } from '../api/mutations'

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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookingLeadTimeHours">
                Booking Lead Time (hours)
              </Label>
              <Input
                id="bookingLeadTimeHours"
                name="bookingLeadTimeHours"
                type="number"
                min="0"
                placeholder="e.g., 24"
              />
              <p className="text-xs text-muted-foreground">
                Minimum hours in advance customers must book
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancellationHours">
                Cancellation Policy (hours)
              </Label>
              <Input
                id="cancellationHours"
                name="cancellationHours"
                type="number"
                min="0"
                placeholder="e.g., 48"
              />
              <p className="text-xs text-muted-foreground">
                Hours before appointment when cancellation is allowed
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isAcceptingBookings">Accept Bookings</Label>
                <p className="text-xs text-muted-foreground">
                  Allow new bookings at all locations
                </p>
              </div>
              <Switch
                id="isAcceptingBookings"
                checked={isAcceptingBookings}
                onCheckedChange={setIsAcceptingBookings}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
