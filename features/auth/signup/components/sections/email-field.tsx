'use client'

import { Mail } from 'lucide-react'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

type EmailFieldProps = {
  error?: string
}

export function EmailField({ error }: EmailFieldProps): React.ReactElement {
  return (
    <Field className="gap-3">
      <FieldLabel htmlFor="email">
        Email address
        <span className="text-destructive" aria-label="required"> *</span>
      </FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <Mail className="size-4" aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? 'email-error email-hint' : 'email-hint'}
          placeholder="you@example.com"
        />
      </InputGroup>
      <FieldDescription id="email-hint">
        We'll send you a verification code to confirm your email
      </FieldDescription>
      {error && (
        <p id="email-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </Field>
  )
}
