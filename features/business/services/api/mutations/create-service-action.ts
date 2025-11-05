'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { canAccessSalon } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { serviceFormSchema } from './action-schemas'
import { generateUniqueSlug } from './action-helpers'
import type { FormState } from './action-types'

/**
 * Create service Server Action
 * Handles form submission with proper validation and error handling
 */
export async function createServiceAction(
  salonId: string,
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const logger = createOperationLogger('createServiceAction', { salonId })
  logger.start()

  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        message: 'You must be logged in to create a service',
        success: false,
      }
    }

    // Check salon access
    if (!(await canAccessSalon(salonId))) {
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

    // Generate unique slug
    const slug = await generateUniqueSlug(salonId, data.name)

    // Insert service
    const { data: service, error: serviceError } = await supabase
      .schema('catalog')
      .from('services')
      .insert({
        salon_id: salonId,
        name: data.name,
        slug,
        description: data.description ?? null,
        category_id: data.category_id ?? null,
        is_active: true,
        is_bookable: data.is_online_booking_enabled,
        created_by_id: user.id,
        updated_by_id: user.id,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .select('id')
      .single()

    if (serviceError || !service) {
      logger.error('Service insert failed', 'database', { error: serviceError })
      return {
        message: serviceError?.message || 'Failed to create service',
        success: false,
      }
    }

    // Insert pricing
    const { error: pricingError } = await supabase
      .schema('catalog')
      .from('service_pricing')
      .insert({
        service_id: service.id,
        base_price: data.base_price,
        current_price: data.base_price,
        currency_code: 'USD',
        is_taxable: true,
        created_by_id: user.id,
        updated_by_id: user.id,
        created_at: timestamp,
        updated_at: timestamp,
      })

    if (pricingError) {
      logger.error('Pricing insert failed', 'database', { error: pricingError })
      // Rollback service
      await supabase.schema('catalog').from('services').delete().eq('id', service.id)
      return {
        message: pricingError.message || 'Failed to create service pricing',
        success: false,
      }
    }

    // Insert booking rules
    const { error: rulesError } = await supabase
      .schema('catalog')
      .from('service_booking_rules')
      .insert({
        service_id: service.id,
        duration_minutes: data.duration_minutes,
        buffer_minutes: data.buffer_minutes,
        total_duration_minutes: data.duration_minutes + data.buffer_minutes,
        requires_deposit: data.requires_deposit,
        deposit_amount: data.deposit_amount ?? null,
        created_by_id: user.id,
        updated_by_id: user.id,
        created_at: timestamp,
        updated_at: timestamp,
      })

    if (rulesError) {
      logger.error('Booking rules insert failed', 'database', { error: rulesError })
      // Rollback service and pricing
      await supabase.schema('catalog').from('service_pricing').delete().eq('service_id', service.id)
      await supabase.schema('catalog').from('services').delete().eq('id', service.id)
      return {
        message: rulesError.message || 'Failed to create booking rules',
        success: false,
      }
    }

    logger.success({
      serviceId: service.id,
      serviceName: data.name,
      basePrice: data.base_price,
    })

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
