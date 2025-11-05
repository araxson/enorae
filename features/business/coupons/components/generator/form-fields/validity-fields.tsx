'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import type { FieldProps } from './types'

export function ValidityFields({ errors }: FieldProps) {
  const validFromError = errors?.['valid_from']?.[0]
  const validUntilError = errors?.['valid_until']?.[0]

  // Get current date and 30 days from now for defaults
  const now = new Date()
  const defaultFrom = now.toISOString().slice(0, 16)
  const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const defaultUntil = futureDate.toISOString().slice(0, 16)

  return (
    <FieldGroup className="grid gap-4 md:grid-cols-2">
      {/* Valid From */}
      <Field>
        <FieldLabel htmlFor="valid_from">
          Valid From
          <span className="text-destructive" aria-label="required"> *</span>
        </FieldLabel>
        <FieldContent>
          <Input
            id="valid_from"
            name="valid_from"
            type="datetime-local"
            required
            aria-required="true"
            aria-invalid={!!validFromError}
            aria-describedby={validFromError ? 'valid-from-error' : undefined}
            defaultValue={defaultFrom}
            className={validFromError ? 'border-destructive' : ''}
          />
          {validFromError && (
            <p id="valid-from-error" className="text-sm text-destructive mt-1" role="alert">
              {validFromError}
            </p>
          )}
        </FieldContent>
      </Field>

      {/* Valid Until */}
      <Field>
        <FieldLabel htmlFor="valid_until">
          Valid Until
          <span className="text-destructive" aria-label="required"> *</span>
        </FieldLabel>
        <FieldContent>
          <Input
            id="valid_until"
            name="valid_until"
            type="datetime-local"
            required
            aria-required="true"
            aria-invalid={!!validUntilError}
            aria-describedby={validUntilError ? 'valid-until-error' : undefined}
            defaultValue={defaultUntil}
            className={validUntilError ? 'border-destructive' : ''}
          />
          {validUntilError && (
            <p id="valid-until-error" className="text-sm text-destructive mt-1" role="alert">
              {validUntilError}
            </p>
          )}
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}

/**
 * Limit fields: min purchase amount and max discount amount
 */
