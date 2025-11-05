'use client'

import { RefObject } from 'react'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'

interface ProfileNameFieldProps {
  defaultValue: string
  error?: string
  disabled?: boolean
  firstErrorRef?: RefObject<HTMLInputElement | null>
}

export function ProfileNameField({
  defaultValue,
  error,
  disabled,
  firstErrorRef,
}: ProfileNameFieldProps) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor="full_name">
        Full name
      </FieldLabel>
      <FieldContent>
        <Input
          ref={firstErrorRef}
          id="full_name"
          name="full_name"
          type="text"
          placeholder="Enter your full name"
          defaultValue={defaultValue}
          aria-invalid={error ? true : false}
          aria-describedby={
            error ? 'full_name-error full_name-hint' : 'full_name-hint'
          }
          disabled={disabled}
        />
        <FieldDescription id="full_name-hint">
          Displayed across your profile.
        </FieldDescription>
        <FieldError
          id="full_name-error"
          errors={error ? [{ message: error }] : undefined}
        />
      </FieldContent>
    </Field>
  )
}
