'use client'

import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field'
import type { BulkCouponFormState } from '../types'

interface DiscountFieldsProps {
  formState: BulkCouponFormState
  updateFormState: (updates: Partial<BulkCouponFormState>) => void
}

/**
 * Discount configuration fields: value and description
 */
export function DiscountFields({ formState, updateFormState }: DiscountFieldsProps) {
  return (
    <FieldGroup className="grid gap-4 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="discount-value">
          Discount Value {formState.discount_type === 'percentage' ? '(%)' : '($)'}
        </FieldLabel>
        <FieldContent>
          <Input
            id="discount-value"
            type="number"
            min={0}
            max={formState.discount_type === 'percentage' ? 100 : undefined}
            step={formState.discount_type === 'percentage' ? 1 : 0.5}
            value={formState.discount_value}
            onChange={(event) => updateFormState({ discount_value: Number(event.target.value) })}
            required
          />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor="description">Campaign Description</FieldLabel>
        <FieldContent>
          <Input
            id="description"
            value={formState.description}
            onChange={(event) => updateFormState({ description: event.target.value })}
            required
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
