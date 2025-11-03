'use client'

import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import type { BulkCouponFormState } from '../../../api/types'

interface BasicInfoFieldsProps {
  formState: BulkCouponFormState
  updateFormState: (updates: Partial<BulkCouponFormState>) => void
}

/**
 * Basic information fields: prefix, count, and discount type
 */
export function BasicInfoFields({ formState, updateFormState }: BasicInfoFieldsProps) {
  return (
    <FieldGroup className="grid gap-4 md:grid-cols-3">
      <Field>
        <FieldLabel htmlFor="prefix">Code Prefix</FieldLabel>
        <FieldContent>
          <Input
            id="prefix"
            value={formState.prefix}
            onChange={(event) => updateFormState({ prefix: event.target.value.toUpperCase() })}
            maxLength={6}
            required
          />
          <FieldDescription>
            Prefix will be combined with random characters for uniqueness.
          </FieldDescription>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="count">Quantity</FieldLabel>
        <FieldContent>
          <Input
            id="count"
            type="number"
            min={1}
            max={100}
            value={formState.count}
            onChange={(event) => updateFormState({ count: Number(event.target.value) })}
            required
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="bulk-discount-type-percentage">Discount Type</FieldLabel>
        <FieldContent>
          <RadioGroup
            value={formState.discount_type}
            onValueChange={(value) =>
              updateFormState({ discount_type: value as 'percentage' | 'fixed' })
            }
            className="flex flex-wrap gap-3 pt-1"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="bulk-discount-type-percentage" value="percentage" />
              <FieldLabel htmlFor="bulk-discount-type-percentage" className="text-sm font-normal">
                Percentage (%)
              </FieldLabel>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="bulk-discount-type-fixed" value="fixed" />
              <FieldLabel htmlFor="bulk-discount-type-fixed" className="text-sm font-normal">
                Fixed Amount ($)
              </FieldLabel>
            </div>
          </RadioGroup>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
