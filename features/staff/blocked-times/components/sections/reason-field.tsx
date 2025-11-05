'use client'

import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

type ReasonFieldProps = {
  defaultValue?: string | null
  error?: string
}

export function ReasonField({ defaultValue, error }: ReasonFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="reason">
        Reason
        <span className="text-destructive" aria-label="required"> *</span>
      </FieldLabel>
      <FieldContent>
        <Textarea
          id="reason"
          name="reason"
          placeholder="Enter reason for blocked time"
          defaultValue={defaultValue || ''}
          required
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? 'reason-error' : undefined}
        />
        {error && (
          <FieldError id="reason-error" role="alert">
            {error}
          </FieldError>
        )}
      </FieldContent>
    </Field>
  )
}
