'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CouponFormState } from '@/features/business/coupons/components/coupon-form.types'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

interface CouponDiscountSectionProps {
  formData: CouponFormState
  onChange: (
    update: CouponFormState | ((current: CouponFormState) => CouponFormState)
  ) => void
}

export function CouponDiscountSection({ formData, onChange }: CouponDiscountSectionProps) {
  const setFormData = onChange

  return (
    <FieldGroup className="grid grid-cols-2 gap-4">
      <Field>
        <FieldLabel htmlFor="discount_type">Discount Type</FieldLabel>
        <FieldContent>
          <Select
            value={formData.discount_type}
            onValueChange={(value: 'percentage' | 'fixed') =>
              setFormData({ ...formData, discount_type: value })
            }
          >
            <SelectTrigger id="discount_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="discount_value">
          Discount Value {formData.discount_type === 'percentage' ? '(%)' : '($)'}
        </FieldLabel>
        <FieldContent>
          <Input
            id="discount_value"
            type="number"
            step={formData.discount_type === 'percentage' ? '1' : '0.01'}
            min="0"
            max={formData.discount_type === 'percentage' ? '100' : undefined}
            value={formData.discount_value}
            onChange={(event) =>
              setFormData({ ...formData, discount_value: parseFloat(event.target.value) })
            }
            required
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="min_purchase">Minimum Purchase ($)</FieldLabel>
        <FieldContent>
          <Input
            id="min_purchase"
            type="number"
            step="0.01"
            min="0"
            value={formData.min_purchase_amount ?? ''}
            onChange={(event) =>
              setFormData({
                ...formData,
                min_purchase_amount: event.target.value ? parseFloat(event.target.value) : null,
              })
            }
          />
        </FieldContent>
        <FieldDescription>Leave blank to remove minimum spend requirements.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="max_discount">Max Discount ($)</FieldLabel>
        <FieldContent>
          <Input
            id="max_discount"
            type="number"
            step="0.01"
            min="0"
            value={formData.max_discount_amount ?? ''}
            onChange={(event) =>
              setFormData({
                ...formData,
                max_discount_amount: event.target.value ? parseFloat(event.target.value) : null,
              })
            }
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
