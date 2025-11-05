'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { createCouponSchema } from '../schemas'

type ActionState = {
  message?: string
  errors?: Record<string, string[]>
  error?: string
  success?: boolean
  redirectUrl?: string
} | null

/**
 * Create a single coupon
 * SECURITY: Business users only, salon ownership verified
 * ACCESSIBILITY: Full error reporting with field-level validation
 */
export async function createCouponAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const logger = createOperationLogger('createCouponAction', {})
  logger.start()

  try {
    // Parse applicable_services array
    const applicableServices: string[] = []
    let serviceIndex = 0
    while (formData.has(`applicable_services[${serviceIndex}]`)) {
      const serviceId = formData.get(`applicable_services[${serviceIndex}]`) as string
      if (serviceId) applicableServices.push(serviceId)
      serviceIndex++
    }

    // Parse applicable_customer_ids from textarea (newline-separated)
    const customerIdsText = formData.get('applicable_customer_ids') as string
    const applicableCustomerIds = customerIdsText
      ? customerIdsText.split('\n').map((id) => id.trim()).filter(Boolean)
      : []

    // Validate with Zod
    const parsed = createCouponSchema.safeParse({
      salon_id: formData.get('salon_id'),
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

    const validated = parsed.data

    // Authentication & Authorization
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    if (!(await canAccessSalon(validated.salon_id))) {
      return { error: 'Unauthorized: You do not have access to this salon' }
    }

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
    // const { data: existing } = await supabase
    //   .schema('marketing')
    //   .from('coupons')
    //   .select('id')
    //   .eq('salon_id', validated.salon_id)
    //   .eq('code', validated.code)
    //   .single()
    //
    // if (existing) {
    //   return {
    //     message: 'Validation failed',
    //     errors: { code: ['This coupon code already exists'] },
    //   }
    // }
    //
    // const { data, error } = await supabase
    //   .schema('marketing')
    //   .from('coupons')
    //   .insert({
    //     salon_id: validated.salon_id,
    //     code: validated.code,
    //     description: validated.description,
    //     discount_type: validated.discount_type,
    //     discount_value: validated.discount_value,
    //     min_purchase_amount: validated.min_purchase_amount,
    //     max_discount_amount: validated.max_discount_amount,
    //     max_uses: validated.max_uses,
    //     max_uses_per_customer: validated.max_uses_per_customer,
    //     valid_from: validated.valid_from,
    //     valid_until: validated.valid_until,
    //     is_active: validated.is_active,
    //     applicable_services: validated.applicable_services,
    //     applicable_customer_ids: validated.applicable_customer_ids,
    //     created_by_id: session.user.id,
    //   })
    //   .select()
    //   .single()
    //
    // if (error) {
    //   logger.error('Failed to create coupon', error)
    //   return { error: 'Failed to create coupon. Please try again.' }
    // }
    //
    // revalidatePath('/business/coupons', 'page')
    //
    // return {
    //   message: 'Coupon created successfully',
    //   success: true,
    //   redirectUrl: '/business/coupons',
    // }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error, 'system')
    }
    return {
      error: error instanceof Error ? error.message : 'Failed to create coupon',
    }
  }
}
