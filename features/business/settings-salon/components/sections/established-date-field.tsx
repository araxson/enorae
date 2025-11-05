'use client'

import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'

interface EstablishedDateFieldProps {
  defaultValue: string | undefined
  isPending: boolean
  errors?: string[]
}

export function EstablishedDateField({
  defaultValue,
  isPending,
  errors,
}: EstablishedDateFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="established_at">Established Date</FieldLabel>
      <FieldContent>
        <Input
          id="established_at"
          name="established_at"
          type="date"
          defaultValue={defaultValue}
          aria-invalid={!!errors}
          aria-describedby={
            errors ? 'established_at-error established_at-hint' : 'established_at-hint'
          }
          disabled={isPending}
          className={errors ? 'border-destructive' : ''}
        />
      </FieldContent>
      <FieldDescription id="established_at-hint">When your business was founded.</FieldDescription>
      {errors && (
        <p id="established_at-error" className="text-sm text-destructive mt-1" role="alert">
          {errors[0]}
        </p>
      )}
    </Field>
  )
}
