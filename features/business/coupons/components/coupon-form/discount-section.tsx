import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CouponFormState } from '@/features/business/coupons/components/coupon-form.types'

interface CouponDiscountSectionProps {
  formData: CouponFormState
  onChange: (
    update: CouponFormState | ((current: CouponFormState) => CouponFormState)
  ) => void
}

export function CouponDiscountSection({ formData, onChange }: CouponDiscountSectionProps) {
  const setFormData = onChange

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="discount_type">Discount Type</Label>
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
      </div>

      <div>
        <Label htmlFor="discount_value">
          Discount Value {formData.discount_type === 'percentage' ? '(%)' : '($)'}
        </Label>
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
      </div>

      <div>
        <Label htmlFor="min_purchase">Minimum Purchase ($)</Label>
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
      </div>

      <div>
        <Label htmlFor="max_discount">Max Discount ($)</Label>
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
      </div>
    </div>
  )
}
