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

export function LimitsFields({ errors }: FieldProps) {
  const minPurchaseError = errors?.['min_purchase_amount']?.[0]
  const maxDiscountError = errors?.['max_discount_amount']?.[0]

  return (
    <FieldGroup className="grid gap-4 md:grid-cols-2">
      {/* Min Purchase Amount */}
      <Field>
        <FieldLabel htmlFor="min_purchase_amount">
          Minimum Purchase Amount (Optional)
        </FieldLabel>
        <FieldContent>
          <Input
            id="min_purchase_amount"
            name="min_purchase_amount"
            type="number"
            min={0}
            step="0.01"
            aria-invalid={!!minPurchaseError}
            aria-describedby={minPurchaseError ? 'min-purchase-error min-purchase-hint' : 'min-purchase-hint'}
            placeholder="0.00"
            className={minPurchaseError ? 'border-destructive' : ''}
          />
          <FieldDescription id="min-purchase-hint">
            Minimum purchase amount required to use this coupon.
          </FieldDescription>
          {minPurchaseError && (
            <p id="min-purchase-error" className="text-sm text-destructive mt-1" role="alert">
              {minPurchaseError}
            </p>
          )}
        </FieldContent>
      </Field>

      {/* Max Discount Amount */}
      <Field>
        <FieldLabel htmlFor="max_discount_amount">
          Maximum Discount Amount (Optional)
        </FieldLabel>
        <FieldContent>
          <Input
            id="max_discount_amount"
            name="max_discount_amount"
            type="number"
            min={0}
            step="0.01"
            aria-invalid={!!maxDiscountError}
            aria-describedby={maxDiscountError ? 'max-discount-error max-discount-hint' : 'max-discount-hint'}
            placeholder="0.00"
            className={maxDiscountError ? 'border-destructive' : ''}
          />
          <FieldDescription id="max-discount-hint">
            Cap the maximum discount amount for percentage-based coupons.
          </FieldDescription>
          {maxDiscountError && (
            <p id="max-discount-error" className="text-sm text-destructive mt-1" role="alert">
              {maxDiscountError}
            </p>
          )}
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}

/**
 * Active toggle field
 */
