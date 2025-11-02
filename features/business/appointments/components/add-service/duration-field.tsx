'use client'

import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type DurationFieldProps = {
  value: string
  onChange: (value: string) => void
}

export function DurationField({ value, onChange }: DurationFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
      <FieldContent>
        <Input
          id="duration"
          type="number"
          min="1"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="e.g., 60"
        />
      </FieldContent>
    </Field>
  )
}
