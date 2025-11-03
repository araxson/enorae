'use client'

import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field'
import type { BulkCouponFormState } from '../../../api/types'

interface ValidityFieldsProps {
  formState: BulkCouponFormState
  updateFormState: (updates: Partial<BulkCouponFormState>) => void
}

/**
 * Validity period fields: valid from and until dates
 */
export function ValidityFields({ formState, updateFormState }: ValidityFieldsProps) {
  return (
    <FieldGroup className="grid gap-4 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="valid-from">Valid From</FieldLabel>
        <FieldContent>
          <Input
            id="valid-from"
            type="datetime-local"
            value={formState.valid_from}
            onChange={(event) => updateFormState({ valid_from: event.target.value })}
            required
          />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor="valid-until">Valid Until</FieldLabel>
        <FieldContent>
          <Input
            id="valid-until"
            type="datetime-local"
            value={formState.valid_until}
            onChange={(event) => updateFormState({ valid_until: event.target.value })}
            required
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
