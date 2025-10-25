import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CouponFormState } from '@/features/business/coupons/components/coupon-form/coupon-form.types'

interface CouponBasicSectionProps {
  formData: CouponFormState
  onChange: (
    update: CouponFormState | ((current: CouponFormState) => CouponFormState)
  ) => void
  onGenerateCode: () => void
}

export function CouponBasicSection({ formData, onChange, onGenerateCode }: CouponBasicSectionProps) {
  const setFormData = onChange

  return (
    <div>
      <Label htmlFor="code">Coupon Code</Label>
      <div className="flex gap-2">
        <Input
          id="code"
          value={formData.code}
          onChange={(event) =>
            setFormData({ ...formData, code: event.target.value.toUpperCase() })
          }
          placeholder="e.g., SAVE20"
          required
        />
        <Button type="button" variant="outline" onClick={onGenerateCode}>
          Generate
        </Button>
      </div>

      <div className="mt-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(event) =>
            setFormData({ ...formData, description: event.target.value })
          }
          placeholder="Describe this promotion..."
          rows={3}
          required
        />
      </div>
    </div>
  )
}
