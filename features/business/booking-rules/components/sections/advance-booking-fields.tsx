'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface AdvanceBookingFieldsProps {
  minAdvanceBookingHours?: number
  maxAdvanceBookingDays?: number
  isPending: boolean
  errors?: {
    minAdvanceBookingHours?: string[]
    maxAdvanceBookingDays?: string[]
  }
}

export function AdvanceBookingFields({
  minAdvanceBookingHours,
  maxAdvanceBookingDays,
  isPending,
  errors,
}: AdvanceBookingFieldsProps) {
  return (
    <>
      {/* Minimum Advance Booking Hours */}
      <div>
        <Label htmlFor="minAdvanceBookingHours">Minimum Advance Booking (hours)</Label>
        <Input
          type="number"
          id="minAdvanceBookingHours"
          name="minAdvanceBookingHours"
          min="0"
          step="1"
          defaultValue={minAdvanceBookingHours ?? ''}
          placeholder="e.g., 24"
          disabled={isPending}
          aria-invalid={!!errors?.minAdvanceBookingHours}
          aria-describedby={
            errors?.minAdvanceBookingHours
              ? 'minAdvanceBookingHours-error minAdvanceBookingHours-hint'
              : 'minAdvanceBookingHours-hint'
          }
        />
        <p id="minAdvanceBookingHours-hint" className="text-sm text-muted-foreground mt-1">
          Minimum hours in advance customers must book
        </p>
        {errors?.minAdvanceBookingHours && (
          <p
            id="minAdvanceBookingHours-error"
            className="text-sm text-destructive mt-1"
            role="alert"
          >
            {errors.minAdvanceBookingHours[0]}
          </p>
        )}
      </div>

      {/* Maximum Advance Booking Days */}
      <div>
        <Label htmlFor="maxAdvanceBookingDays">Maximum Advance Booking (days)</Label>
        <Input
          type="number"
          id="maxAdvanceBookingDays"
          name="maxAdvanceBookingDays"
          min="0"
          step="1"
          defaultValue={maxAdvanceBookingDays ?? ''}
          placeholder="e.g., 90"
          disabled={isPending}
          aria-invalid={!!errors?.maxAdvanceBookingDays}
          aria-describedby={
            errors?.maxAdvanceBookingDays
              ? 'maxAdvanceBookingDays-error maxAdvanceBookingDays-hint'
              : 'maxAdvanceBookingDays-hint'
          }
        />
        <p id="maxAdvanceBookingDays-hint" className="text-sm text-muted-foreground mt-1">
          Maximum days in advance customers can book
        </p>
        {errors?.maxAdvanceBookingDays && (
          <p
            id="maxAdvanceBookingDays-error"
            className="text-sm text-destructive mt-1"
            role="alert"
          >
            {errors.maxAdvanceBookingDays[0]}
          </p>
        )}
      </div>
    </>
  )
}
