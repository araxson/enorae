'use client'

import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field'
import type { BulkCouponFormState } from '@/features/business/coupons/api/types'

interface ConstraintFieldsProps {
  formState: BulkCouponFormState
  updateFormState: (updates: Partial<BulkCouponFormState>) => void
}

/**
 * Constraint fields: minimum purchase and maximum discount amounts
 */
export function ConstraintFields({ formState, updateFormState }: ConstraintFieldsProps) {
  return (
    <FieldGroup className="grid gap-4 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="min-purchase">Minimum Purchase ($)</FieldLabel>
        <FieldContent>
          <Input
            id="min-purchase"
            type="number"
            min={0}
            step={0.5}
            value={formState.min_purchase_amount ?? ''}
            onChange={(event) =>
              updateFormState({
                min_purchase_amount: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor="max-discount">Maximum Discount ($)</FieldLabel>
        <FieldContent>
          <Input
            id="max-discount"
            type="number"
            min={0}
            step={0.5}
            value={formState.max_discount_amount ?? ''}
            onChange={(event) =>
              updateFormState({
                max_discount_amount: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
