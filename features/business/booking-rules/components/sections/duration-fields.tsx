'use client'

import { RefObject } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface DurationFieldsProps {
  durationMinutes?: number
  bufferMinutes?: number
  isPending: boolean
  errors?: {
    durationMinutes?: string[]
    bufferMinutes?: string[]
  }
  firstErrorRef?: RefObject<HTMLInputElement | null>
}

export function DurationFields({
  durationMinutes,
  bufferMinutes,
  isPending,
  errors,
  firstErrorRef,
}: DurationFieldsProps) {
  return (
    <>
      {/* Duration Minutes */}
      <div>
        <Label htmlFor="durationMinutes">Duration (minutes)</Label>
        <Input
          ref={errors?.durationMinutes ? firstErrorRef : null}
          type="number"
          id="durationMinutes"
          name="durationMinutes"
          min="0"
          step="1"
          defaultValue={durationMinutes ?? ''}
          placeholder="Optional override"
          disabled={isPending}
          aria-invalid={!!errors?.durationMinutes}
          aria-describedby={
            errors?.durationMinutes
              ? 'durationMinutes-error durationMinutes-hint'
              : 'durationMinutes-hint'
          }
        />
        <p id="durationMinutes-hint" className="text-sm text-muted-foreground mt-1">
          Override service duration for booking purposes
        </p>
        {errors?.durationMinutes && (
          <p id="durationMinutes-error" className="text-sm text-destructive mt-1" role="alert">
            {errors.durationMinutes[0]}
          </p>
        )}
      </div>

      {/* Buffer Minutes */}
      <div>
        <Label htmlFor="bufferMinutes">Buffer (minutes)</Label>
        <Input
          type="number"
          id="bufferMinutes"
          name="bufferMinutes"
          min="0"
          step="1"
          defaultValue={bufferMinutes ?? ''}
          placeholder="Optional override"
          disabled={isPending}
          aria-invalid={!!errors?.bufferMinutes}
          aria-describedby={
            errors?.bufferMinutes ? 'bufferMinutes-error bufferMinutes-hint' : 'bufferMinutes-hint'
          }
        />
        <p id="bufferMinutes-hint" className="text-sm text-muted-foreground mt-1">
          Buffer time between appointments
        </p>
        {errors?.bufferMinutes && (
          <p id="bufferMinutes-error" className="text-sm text-destructive mt-1" role="alert">
            {errors.bufferMinutes[0]}
          </p>
        )}
      </div>
    </>
  )
}
