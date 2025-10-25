import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { CouponFormState } from '@/features/business/coupons/components/coupon-form.types'

interface CouponActivationSectionProps {
  formData: CouponFormState
  onChange: (
    update: CouponFormState | ((current: CouponFormState) => CouponFormState)
  ) => void
}

export function CouponActivationSection({ formData, onChange }: CouponActivationSectionProps) {
  const setFormData = onChange

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="is_active">Active</Label>
      <Switch
        id="is_active"
        checked={formData.is_active}
        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
      />
    </div>
  )
}
