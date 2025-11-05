'use client'

import { RefObject } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface LocationNameFieldProps {
  defaultValue?: string
  isPending: boolean
  errors?: string[]
  firstErrorRef?: RefObject<HTMLInputElement | null>
}

export function LocationNameField({
  defaultValue = '',
  isPending,
  errors,
  firstErrorRef,
}: LocationNameFieldProps) {
  return (
    <div>
      <Label htmlFor="name">
        Location Name
        <span className="text-destructive" aria-label="required"> *</span>
      </Label>
      <Input
        ref={errors ? firstErrorRef : null}
        id="name"
        name="name"
        type="text"
        defaultValue={defaultValue}
        placeholder="Main Branch"
        required
        maxLength={200}
        disabled={isPending}
        aria-required="true"
        aria-invalid={!!errors}
        aria-describedby={errors ? 'name-error name-hint' : 'name-hint'}
      />
      <p id="name-hint" className="text-sm text-muted-foreground mt-1">
        A descriptive name for this location
      </p>
      {errors && (
        <p id="name-error" className="text-sm text-destructive mt-1" role="alert">
          {errors[0]}
        </p>
      )}
    </div>
  )
}
