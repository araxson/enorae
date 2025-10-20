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
import { Stack } from '@/components/layout'
import type { BookingRuleWithService } from '../api/queries'

interface BookingRuleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule?: BookingRuleWithService | null
  services: Array<{ id: string; name: string }>
  onSubmit: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
}

export function BookingRuleForm({
  open,
  onOpenChange,
  rule,
  services,
  onSubmit,
}: BookingRuleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const result = await onSubmit(formData)

    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(rule ? 'Rule updated successfully' : 'Rule created successfully')
      onOpenChange(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{rule ? 'Edit' : 'Create'} Booking Rule</DialogTitle>
            <DialogDescription>
              Configure booking constraints for a service
            </DialogDescription>
          </DialogHeader>

          <Stack gap="md" className="my-4">
            <div>
              <Label htmlFor="serviceId">Service</Label>
              <select
                id="serviceId"
                name="serviceId"
                required
                disabled={!!rule}
                defaultValue={rule?.service_id || ''}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              {rule && (
                <p className="text-xs text-muted-foreground mt-1">
                  Service cannot be changed. Create a new rule for different services.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="durationMinutes">Service Duration (minutes)</Label>
              <Input
                type="number"
                id="durationMinutes"
                name="durationMinutes"
                min={0}
                step={5}
                defaultValue={rule?.duration_minutes || ''}
                placeholder="e.g., 60"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How long the service takes
              </p>
            </div>

            <div>
              <Label htmlFor="bufferMinutes">Buffer Time (minutes)</Label>
              <Input
                type="number"
                id="bufferMinutes"
                name="bufferMinutes"
                min={0}
                step={5}
                defaultValue={rule?.buffer_minutes || ''}
                placeholder="e.g., 15"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Time between appointments for cleanup/preparation
              </p>
            </div>

            <div>
              <Label htmlFor="minAdvanceBookingHours">Minimum Advance Booking (hours)</Label>
              <Input
                type="number"
                id="minAdvanceBookingHours"
                name="minAdvanceBookingHours"
                min={0}
                step={1}
                defaultValue={rule?.min_advance_booking_hours || ''}
                placeholder="e.g., 2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How far in advance customers must book (minimum)
              </p>
            </div>

            <div>
              <Label htmlFor="maxAdvanceBookingDays">Maximum Advance Booking (days)</Label>
              <Input
                type="number"
                id="maxAdvanceBookingDays"
                name="maxAdvanceBookingDays"
                min={0}
                step={1}
                defaultValue={rule?.max_advance_booking_days || ''}
                placeholder="e.g., 90"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How far in advance customers can book (maximum)
              </p>
            </div>
          </Stack>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : rule ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
