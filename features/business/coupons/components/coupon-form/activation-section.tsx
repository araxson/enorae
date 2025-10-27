import { Switch } from '@/components/ui/switch'
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item'
import type { CouponFormState } from '@/features/business/coupons/components/coupon-form.types'
import { FieldLabel } from '@/components/ui/field'

interface CouponActivationSectionProps {
  formData: CouponFormState
  onChange: (
    update: CouponFormState | ((current: CouponFormState) => CouponFormState)
  ) => void
}

export function CouponActivationSection({ formData, onChange }: CouponActivationSectionProps) {
  const setFormData = onChange

  return (
    <ItemGroup>
      <Item>
        <ItemContent>
          <ItemTitle>
            <FieldLabel htmlFor="is_active">Active</FieldLabel>
          </ItemTitle>
        </ItemContent>
        <ItemActions className="flex-none">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
        </ItemActions>
      </Item>
    </ItemGroup>
  )
}
