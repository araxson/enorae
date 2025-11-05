'use client'

import { RefObject } from 'react'
import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'

interface BusinessNameFieldProps {
  defaultValue: string
  isPending: boolean
  errors?: string[]
  firstErrorRef?: RefObject<HTMLInputElement | null>
}

export function BusinessNameField({
  defaultValue,
  isPending,
  errors,
  firstErrorRef,
}: BusinessNameFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="business_name">
        Business Name
        <span className="text-destructive" aria-label="required">
          {' '}
          *
        </span>
      </FieldLabel>
      <FieldContent>
        <Input
          ref={errors ? firstErrorRef : null}
          id="business_name"
          name="business_name"
          type="text"
          placeholder="e.g., Elite Hair & Beauty LLC"
          maxLength={200}
          defaultValue={defaultValue}
          required
          aria-required="true"
          aria-invalid={!!errors}
          aria-describedby={
            errors ? 'business_name-error business_name-hint' : 'business_name-hint'
          }
          disabled={isPending}
          className={errors ? 'border-destructive' : ''}
        />
      </FieldContent>
      <FieldDescription id="business_name-hint">
        Your legal business name (if different from salon name).
      </FieldDescription>
      {errors && (
        <p id="business_name-error" className="text-sm text-destructive mt-1" role="alert">
          {errors[0]}
        </p>
      )}
    </Field>
  )
}
