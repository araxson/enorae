'use client'

import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { PasswordInput } from '@/features/auth/common/components'

type PasswordFieldProps = {
  error?: string
}

export function PasswordField({ error }: PasswordFieldProps): React.ReactElement {
  return (
    <Field className="gap-3">
      <FieldLabel htmlFor="password">
        Password
        <span className="text-destructive" aria-label="required"> *</span>
      </FieldLabel>
      <PasswordInput
        id="password"
        name="password"
        autoComplete="new-password"
        required
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'password-error password-hint' : 'password-hint'}
        minLength={8}
      />
      <FieldDescription id="password-hint">
        Must be at least 8 characters with uppercase, lowercase, number, and special character
      </FieldDescription>
      {error && (
        <p id="password-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </Field>
  )
}
