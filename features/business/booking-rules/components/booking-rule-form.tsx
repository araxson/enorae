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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BookingRuleWithService } from '@/features/business/booking-rules/api/queries'

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
  const [selectedServiceId, setSelectedServiceId] = useState<string>(rule?.service_id || '')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('serviceId', selectedServiceId)
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

          <div className="flex flex-col gap-4 my-4">
            <div>
              <Label htmlFor="serviceId">Service</Label>
              <Select
                value={selectedServiceId}
                onValueChange={setSelectedServiceId}
                disabled={!!rule}
              >
                <SelectTrigger id="serviceId">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {rule && (
                <p className="text-muted-foreground mt-1">
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
              <p className="text-muted-foreground mt-1">
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
              <p className="text-muted-foreground mt-1">
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
              <p className="text-muted-foreground mt-1">
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
              <p className="text-muted-foreground mt-1">
                How far in advance customers can book (maximum)
              </p>
            </div>
          </div>

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
