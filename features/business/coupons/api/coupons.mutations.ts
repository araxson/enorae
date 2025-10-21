'use server'

export const COUPONS_UNSUPPORTED_MESSAGE =
  'Coupons feature is disabled because the Supabase project does not include coupon tables. Remove coupon usage or add the necessary schema.'

export async function createCoupon(..._args: unknown[]): Promise<never> {
  throw new Error(COUPONS_UNSUPPORTED_MESSAGE)
}

export async function updateCoupon(..._args: unknown[]): Promise<never> {
  throw new Error(COUPONS_UNSUPPORTED_MESSAGE)
}

export async function deleteCoupon(..._args: unknown[]): Promise<never> {
  throw new Error(COUPONS_UNSUPPORTED_MESSAGE)
}

export async function toggleCouponStatus(..._args: unknown[]): Promise<never> {
  throw new Error(COUPONS_UNSUPPORTED_MESSAGE)
}

export async function applyCoupon(..._args: unknown[]): Promise<never> {
  throw new Error(COUPONS_UNSUPPORTED_MESSAGE)
}

export async function bulkGenerateCoupons(..._args: unknown[]): Promise<never> {
}
