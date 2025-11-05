'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { toggleCouponStatusSchema } from '../schemas'

type ActionState = {
  message?: string
  errors?: Record<string, string[]>
  error?: string
  success?: boolean
} | null

/**
 * Toggle coupon active status
 * SECURITY: Business users only, salon ownership verified
 */
export async function toggleCouponStatusAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = toggleCouponStatusSchema.safeParse({
      id: formData.get('id'),
      is_active: formData.get('is_active') === 'true',
    })

    if (!parsed.success) {
      return {
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      }
    }

    const validated = parsed.data

    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // NOTE: marketing schema and coupons table don't exist in database
    // This feature is not yet implemented - return appropriate error
    // TODO: Implement when marketing schema and coupons table are added
    return {
      error: 'Coupon management feature is not yet available. Please check back later.',
      success: false,
    }

    // FUTURE IMPLEMENTATION (when marketing schema exists):
    // const supabase = await createClient()
    //
    // const { data: coupon } = await supabase
    //   .schema('marketing')
    //   .from('coupons')
    //   .select('salon_id')
    //   .eq('id', validated.id)
    //   .single()
    //
    // if (!coupon || !(await canAccessSalon(coupon.salon_id))) {
    //   return { error: 'Unauthorized: Coupon not found or not yours' }
    // }
    //
    // const { error } = await supabase
    //   .schema('marketing')
    //   .from('coupons')
    //   .update({
    //     is_active: validated.is_active,
    //     updated_by_id: session.user.id,
    //   })
    //   .eq('id', validated.id)
    //
    // if (error) {
    //   return { error: 'Failed to toggle coupon status' }
    // }
    //
    // revalidatePath('/business/coupons', 'page')
    //
    // return {
    //   message: `Coupon ${validated.is_active ? 'activated' : 'deactivated'} successfully`,
    //   success: true,
    // }
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : 'Failed to toggle coupon status',
    }
  }
}
