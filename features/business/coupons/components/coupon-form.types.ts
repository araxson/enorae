import type { CouponWithStats } from '../api/queries/coupon-validation'

export interface CouponFormProps {
  salonId: string
  services: { id: string; name: string }[]
  coupon?: CouponWithStats
  onSuccess?: () => void
}

export type CouponFormState = {
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_purchase_amount: number | null
  max_discount_amount: number | null
  max_uses: number | null
  max_uses_per_customer: number | null
  valid_from: string
  valid_until: string
  is_active: boolean
  applicable_services: string[]
  applicable_customer_ids: string
}

export const defaultCouponFormState: CouponFormState = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: 0,
  min_purchase_amount: null,
  max_discount_amount: null,
  max_uses: null,
  max_uses_per_customer: 1,
  valid_from: '',
  valid_until: '',
  is_active: true,
  applicable_services: [],
  applicable_customer_ids: '',
}
