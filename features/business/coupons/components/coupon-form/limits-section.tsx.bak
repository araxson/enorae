import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CouponFormState } from '@/features/business/coupons/components/coupon-form/coupon-form.types'

interface CouponLimitsSectionProps {
  formData: CouponFormState
  onChange: (
    update: CouponFormState | ((current: CouponFormState) => CouponFormState)
  ) => void
}

export function CouponLimitsSection({ formData, onChange }: CouponLimitsSectionProps) {
  const setFormData = onChange

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="max_uses">Max Total Uses</Label>
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
      </div>

      <div>
        <Label htmlFor="max_uses_per_customer">Max Uses Per Customer</Label>
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
      </div>

      <div>
        <Label htmlFor="valid_from">Valid From</Label>
        <Input
          id="valid_from"
          type="datetime-local"
          value={formData.valid_from}
          onChange={(event) =>
            setFormData({ ...formData, valid_from: event.target.value })
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="valid_until">Valid Until</Label>
        <Input
          id="valid_until"
          type="datetime-local"
          value={formData.valid_until}
          onChange={(event) =>
            setFormData({ ...formData, valid_until: event.target.value })
          }
          required
        />
      </div>
    </div>
  )
}
