'use client'

import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'

type RecurringFieldProps = {
  defaultValue?: boolean
  error?: string
}

export function RecurringField({ defaultValue, error }: RecurringFieldProps) {
  return (
    <Field orientation="horizontal">
      <FieldLabel htmlFor="is_recurring">Recurring</FieldLabel>
      <FieldContent>
        <input type="hidden" name="is_recurring" value="false" />
        <Switch
          id="is_recurring"
          name="is_recurring"
          defaultChecked={defaultValue || false}
          aria-describedby={error ? 'is_recurring-error' : undefined}
        />
        {error && (
          <FieldError id="is_recurring-error" role="alert">
            {error}
          </FieldError>
        )}
      </FieldContent>
    </Field>
  )
}
