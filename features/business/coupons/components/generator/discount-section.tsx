'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import type { BulkFormSectionsProps } from './types'

export function DiscountSection({ formState, onChange }: BulkFormSectionsProps) {
  return (
    <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
            onChange={(event) =>
              onChange({ discount_value: Number(event.target.value) })
            }
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
            onChange={(event) =>
              onChange({ description: event.target.value })
            }
            required
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
