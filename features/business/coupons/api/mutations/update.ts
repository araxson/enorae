'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { updateCouponSchema } from '../schemas'

type ActionState = {
  message?: string
  errors?: Record<string, string[]>
  error?: string
  success?: boolean
} | null

/**
 * Update an existing coupon
 * SECURITY: Business users only, salon ownership verified
 */
export async function updateCouponAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const logger = createOperationLogger('updateCouponAction', {})
  logger.start()

  try {
    const couponId = formData.get('id') as string

    // Parse applicable_services array
    const applicableServices: string[] = []
    let serviceIndex = 0
    while (formData.has(`applicable_services[${serviceIndex}]`)) {
      const serviceId = formData.get(`applicable_services[${serviceIndex}]`) as string
      if (serviceId) applicableServices.push(serviceId)
      serviceIndex++
    }

    // Parse applicable_customer_ids from textarea
    const customerIdsText = formData.get('applicable_customer_ids') as string
    const applicableCustomerIds = customerIdsText
      ? customerIdsText.split('\n').map((id) => id.trim()).filter(Boolean)
      : []

    // Validate with Zod
    const parsed = updateCouponSchema.safeParse({
      id: couponId,
      code: formData.get('code'),
      description: formData.get('description'),
      discount_type: formData.get('discount_type'),
      discount_value: formData.get('discount_value'),
      min_purchase_amount: formData.get('min_purchase_amount') || null,
      max_discount_amount: formData.get('max_discount_amount') || null,
      max_uses: formData.get('max_uses') || null,
      max_uses_per_customer: formData.get('max_uses_per_customer') || null,
      valid_from: formData.get('valid_from'),
      valid_until: formData.get('valid_until'),
      is_active: formData.get('is_active') === 'true',
      applicable_services: applicableServices,
      applicable_customer_ids: applicableCustomerIds,
    })

    if (!parsed.success) {
      return {
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      }
    }

    const { id, ...updateData } = parsed.data

    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // NOTE: marketing schema and coupons table don't exist in database
    // This feature is not yet implemented - return appropriate error
    // TODO: Implement when marketing schema and coupons table are added
    logger.error('Coupon feature not implemented', 'not_found', { userId: session.user.id })
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
    //   .eq('id', id)
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
    //     ...updateData,
    //     updated_by_id: session.user.id,
    //   })
    //   .eq('id', id)
    //
    // if (error) {
    //   logger.error('Failed to update coupon', error)
    //   return { error: 'Failed to update coupon. Please try again.' }
    // }
    //
    // revalidatePath('/business/coupons', 'page')
    //
    // return {
    //   message: 'Coupon updated successfully',
    //   success: true,
    // }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error, 'system')
    }
    return {
      error: error instanceof Error ? error.message : 'Failed to update coupon',
    }
  }
}
