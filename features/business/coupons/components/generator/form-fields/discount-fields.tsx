'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import type { FieldProps } from './types'

export function DiscountFields({ errors }: FieldProps) {
  const discountValueError = errors?.['discount_value']?.[0]

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="discount_value">
          Discount Value
          <span className="text-destructive" aria-label="required"> *</span>
        </FieldLabel>
        <FieldContent>
          <Input
            id="discount_value"
            name="discount_value"
            type="number"
            min={0}
            step="0.01"
            required
            aria-required="true"
            aria-invalid={!!discountValueError}
            aria-describedby={discountValueError ? 'discount-value-error discount-value-hint' : 'discount-value-hint'}
            defaultValue={10}
            className={discountValueError ? 'border-destructive' : ''}
          />
          <FieldDescription id="discount-value-hint">
            For percentage: 1-100. For fixed amount: any positive number.
          </FieldDescription>
          {discountValueError && (
            <p id="discount-value-error" className="text-sm text-destructive mt-1" role="alert">
              {discountValueError}
            </p>
          )}
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}

/**
 * Validity date fields
 */
