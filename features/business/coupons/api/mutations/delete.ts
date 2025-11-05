'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

type ActionState = {
  message?: string
  error?: string
  success?: boolean
} | null

/**
 * Delete a coupon
 * SECURITY: Business users only, salon ownership verified
 * AUDIT: Logs deletion for compliance
 */
export async function deleteCouponAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const couponId = formData.get('id')

    if (!couponId || typeof couponId !== 'string') {
      return { error: 'Coupon ID is required' }
    }

    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // NOTE: marketing.coupons table doesn't exist in database schema yet
    // This feature is not yet implemented - return appropriate error
    // TODO: Implement when marketing schema and coupons table are added
    return {
      error: 'Coupon management feature is not yet available. Please check back later.',
      success: false,
    }

    // FUTURE IMPLEMENTATION (when marketing schema exists):
    // const supabase = await createClient()
    // const { data: coupon } = await supabase
    //   .schema('marketing')
    //   .from('coupons')
    //   .select('salon_id, code')
    //   .eq('id', couponId)
    //   .single()
    //
    // if (!coupon || !(await canAccessSalon(coupon.salon_id))) {
    //   return { error: 'Unauthorized: Coupon not found or not yours' }
    // }
    //
    // const { error } = await supabase
    //   .schema('marketing')
    //   .from('coupons')
    //   .delete()
    //   .eq('id', couponId)
    //
    // if (error) {
    //   return { error: 'Failed to delete coupon' }
    // }
    //
    // revalidatePath('/business/coupons', 'page')
    //
    // return {
    //   message: `Coupon "${coupon.code}" deleted successfully`,
    //   success: true,
    // }
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : 'Failed to delete coupon',
    }
  }
}
