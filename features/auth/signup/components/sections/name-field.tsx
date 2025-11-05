'use client'

import { User } from 'lucide-react'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

type NameFieldProps = {
  error?: string
  ref?: React.Ref<HTMLInputElement>
}

export function NameField({ error, ref }: NameFieldProps): React.ReactElement {
  return (
    <Field className="gap-3">
      <FieldLabel htmlFor="full_name">
        Full name
        <span className="text-destructive" aria-label="required"> *</span>
      </FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <User className="size-4" aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          ref={ref}
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? 'full_name-error full_name-hint' : 'full_name-hint'}
          placeholder="John Doe"
          maxLength={100}
        />
      </InputGroup>
      <FieldDescription id="full_name-hint">
        Your full name as it should appear on your profile
      </FieldDescription>
      {error && (
        <p id="full_name-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </Field>
  )
}
