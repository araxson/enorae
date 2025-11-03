'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import type { BulkFormSectionsProps } from '../../api/types'

export function LimitsSection({ formState, onChange }: BulkFormSectionsProps) {
  return (
    <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
              onChange({
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
              onChange({
                max_discount_amount: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
