'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { canAccessSalon } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { serviceFormSchema } from './action-schemas'
import type { FormState } from './action-types'

/**
 * Update service Server Action
 * Handles service updates with proper validation
 */
export async function updateServiceAction(
  serviceId: string,
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const logger = createOperationLogger('updateServiceAction', { serviceId })
  logger.start()

  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        message: 'You must be logged in to update a service',
        success: false,
      }
    }

    // Get service to check access
    const { data: service, error: serviceError } = await supabase
      .schema('catalog')
      .from('services')
      .select('salon_id')
      .eq('id', serviceId)
      .single()

    if (serviceError || !service) {
      return {
        message: 'Service not found',
        success: false,
      }
    }

    // Check salon access
    if (!(await canAccessSalon(service.salon_id))) {
      logger.error('Unauthorized access attempt', 'permission', { userId: user.id })
      return {
        message: 'Unauthorized: You do not have access to this salon',
        success: false,
      }
    }

    // Parse and validate form data
    const parsed = serviceFormSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      category_id: formData.get('category_id'),
      base_price: formData.get('base_price'),
      duration_minutes: formData.get('duration_minutes'),
      buffer_minutes: formData.get('buffer_minutes'),
      is_online_booking_enabled: formData.get('is_online_booking_enabled') === 'true',
      requires_deposit: formData.get('requires_deposit') === 'true',
      deposit_amount: formData.get('deposit_amount'),
    })

    if (!parsed.success) {
      logger.error('Validation failed', 'validation', {
        errors: parsed.error.flatten().fieldErrors,
      })
      return {
        message: 'Please fix the errors below',
        errors: parsed.error.flatten().fieldErrors,
        success: false,
      }
    }

    const data = parsed.data
    const timestamp = new Date().toISOString()

    // Update service
    const { error: updateServiceError } = await supabase
      .schema('catalog')
      .from('services')
      .update({
        name: data.name,
        description: data.description ?? null,
        category_id: data.category_id ?? null,
        is_bookable: data.is_online_booking_enabled,
        updated_by_id: user.id,
        updated_at: timestamp,
      })
      .eq('id', serviceId)

    if (updateServiceError) {
      logger.error('Service update failed', 'database', { error: updateServiceError })
      return {
        message: updateServiceError.message || 'Failed to update service',
        success: false,
      }
    }

    // Update pricing
    const { error: updatePricingError } = await supabase
      .schema('catalog')
      .from('service_pricing')
      .update({
        base_price: data.base_price,
        current_price: data.base_price,
        updated_by_id: user.id,
        updated_at: timestamp,
      })
      .eq('service_id', serviceId)

    if (updatePricingError) {
      logger.error('Pricing update failed', 'database', { error: updatePricingError })
      return {
        message: updatePricingError.message || 'Failed to update pricing',
        success: false,
      }
    }

    // Update booking rules
    const { error: updateRulesError } = await supabase
      .schema('catalog')
      .from('service_booking_rules')
      .update({
        duration_minutes: data.duration_minutes,
        buffer_minutes: data.buffer_minutes,
        total_duration_minutes: data.duration_minutes + data.buffer_minutes,
        requires_deposit: data.requires_deposit,
        deposit_amount: data.deposit_amount ?? null,
        updated_by_id: user.id,
        updated_at: timestamp,
      })
      .eq('service_id', serviceId)

    if (updateRulesError) {
      logger.error('Booking rules update failed', 'database', { error: updateRulesError })
      return {
        message: updateRulesError.message || 'Failed to update booking rules',
        success: false,
      }
    }

    logger.success({ serviceName: data.name })

    // Revalidate and redirect
    revalidatePath('/business/services', 'page')
    redirect('/business/services')
  } catch (error) {
    logger.error('Unexpected error', 'system', { error })
    return {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      success: false,
    }
  }
}
