'use client'

import { Textarea } from '@/components/ui/textarea'
import type { CouponFormState } from '../../api/types'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'

interface CouponCustomersSectionProps {
  formData: CouponFormState
  onChange: (
    update: CouponFormState | ((current: CouponFormState) => CouponFormState)
  ) => void
}

export function CouponCustomersSection({ formData, onChange }: CouponCustomersSectionProps) {
  const setFormData = onChange

  return (
    <Field>
      <FieldLabel htmlFor="customer_segments">Limit to customer IDs (optional)</FieldLabel>
      <FieldContent>
        <Textarea
          id="customer_segments"
          value={formData.applicable_customer_ids}
          placeholder="Paste customer IDs, one per line"
          onChange={(event) =>
            setFormData({
              ...formData,
              applicable_customer_ids: event.target.value,
            })
          }
          rows={4}
        />
      </FieldContent>
      <FieldDescription>
        Use this to target loyalty members or VIP customers. Leave blank to apply to all customers.
      </FieldDescription>
    </Field>
  )
}
