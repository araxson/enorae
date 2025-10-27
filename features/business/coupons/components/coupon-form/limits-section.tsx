import { Input } from '@/components/ui/input'
import type { CouponFormState } from '@/features/business/coupons/components/coupon-form.types'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

interface CouponLimitsSectionProps {
  formData: CouponFormState
  onChange: (
    update: CouponFormState | ((current: CouponFormState) => CouponFormState)
  ) => void
}

export function CouponLimitsSection({ formData, onChange }: CouponLimitsSectionProps) {
  const setFormData = onChange

  return (
    <FieldGroup className="grid grid-cols-2 gap-4">
      <Field>
        <FieldLabel htmlFor="max_uses">Max Total Uses</FieldLabel>
        <FieldContent>
          <Input
            id="max_uses"
            type="number"
            min="1"
            value={formData.max_uses ?? ''}
            onChange={(event) =>
              setFormData({
                ...formData,
                max_uses: event.target.value ? parseInt(event.target.value, 10) : null,
              })
            }
            placeholder="Unlimited"
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="max_uses_per_customer">Max Uses Per Customer</FieldLabel>
        <FieldContent>
          <Input
            id="max_uses_per_customer"
            type="number"
            min="1"
            value={formData.max_uses_per_customer ?? ''}
            onChange={(event) =>
              setFormData({
                ...formData,
                max_uses_per_customer: event.target.value
                  ? parseInt(event.target.value, 10)
                  : null,
              })
            }
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="valid_from">Valid From</FieldLabel>
        <FieldContent>
          <Input
            id="valid_from"
            type="datetime-local"
            value={formData.valid_from}
            onChange={(event) =>
              setFormData({ ...formData, valid_from: event.target.value })
            }
            required
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="valid_until">Valid Until</FieldLabel>
        <FieldContent>
          <Input
            id="valid_until"
            type="datetime-local"
            value={formData.valid_until}
            onChange={(event) =>
              setFormData({ ...formData, valid_until: event.target.value })
            }
            required
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
