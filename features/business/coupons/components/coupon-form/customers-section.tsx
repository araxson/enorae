import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CouponFormState } from '@/features/business/coupons/components/coupon-form.types'

interface CouponCustomersSectionProps {
  formData: CouponFormState
  onChange: (
    update: CouponFormState | ((current: CouponFormState) => CouponFormState)
  ) => void
}

export function CouponCustomersSection({ formData, onChange }: CouponCustomersSectionProps) {
  const setFormData = onChange

  return (
    <div>
      <Label htmlFor="customer_segments">Limit to customer IDs (optional)</Label>
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
      <p className="text-xs text-muted-foreground mt-1">
        Use this to target loyalty members or VIP customers. Leave blank to apply to all customers.
      </p>
    </div>
  )
}
