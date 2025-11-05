'use client'

import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'

interface BusinessTypeFieldProps {
  defaultValue: string
  isPending: boolean
  errors?: string[]
}

export function BusinessTypeField({ defaultValue, isPending, errors }: BusinessTypeFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="business_type">Business Type</FieldLabel>
      <FieldContent>
        <Input
          id="business_type"
          name="business_type"
          type="text"
          placeholder="e.g., LLC, Corporation, Sole Proprietorship"
          maxLength={100}
          defaultValue={defaultValue}
          aria-invalid={!!errors}
          aria-describedby={
            errors ? 'business_type-error business_type-hint' : 'business_type-hint'
          }
          disabled={isPending}
          className={errors ? 'border-destructive' : ''}
        />
      </FieldContent>
      <FieldDescription id="business_type-hint">Your business entity type.</FieldDescription>
      {errors && (
        <p id="business_type-error" className="text-sm text-destructive mt-1" role="alert">
          {errors[0]}
        </p>
      )}
    </Field>
  )
}
