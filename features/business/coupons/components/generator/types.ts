export interface BulkCouponFormState {
  prefix: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  count: number
  valid_from: string
  valid_until: string
  is_active: boolean
  min_purchase_amount: number | null
  max_discount_amount: number | null
}

export interface BulkCouponGeneratorProps {
  salonId: string
}
