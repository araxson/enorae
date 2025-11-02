'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ruleSchema } from '@/features/business/booking-rules/api/schema'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function upsertBookingRule(formData: FormData) {
  const logger = createOperationLogger('upsertBookingRule', {})
  logger.start()

  try {
    const result = ruleSchema.safeParse({
      serviceId: formData.get('serviceId'),
      durationMinutes: formData.get('durationMinutes') ? parseInt(formData.get('durationMinutes') as string) : undefined,
      bufferMinutes: formData.get('bufferMinutes') ? parseInt(formData.get('bufferMinutes') as string) : undefined,
      minAdvanceBookingHours: formData.get('minAdvanceBookingHours') ? parseInt(formData.get('minAdvanceBookingHours') as string) : undefined,
      maxAdvanceBookingDays: formData.get('maxAdvanceBookingDays') ? parseInt(formData.get('maxAdvanceBookingDays') as string) : undefined,
    })

    if (!result.success) return { error: result.error.issues[0]?.message ?? 'Validation failed' }

    const data = result.data
    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // SECURITY: Verify the service belongs to user's salon
    const { data: service, error: serviceError } = await supabase
      .schema('catalog')
      .from('services')
      .select('salon_id')
      .eq('id', data.serviceId)
      .single<{ salon_id: string | null }>()

    if (serviceError || !service) return { error: 'Service not found' }
    if (service.salon_id !== staffProfile.salon_id) {
      return { error: 'Unauthorized: Service not found for your salon' }
    }

    const totalDuration = (data.durationMinutes || 0) + (data.bufferMinutes || 0)

    const { error: upsertError } = await supabase
      .schema('catalog')
      .from('service_booking_rules')
      .upsert(
        {
          service_id: data.serviceId,
          duration_minutes: data.durationMinutes ?? null,
          buffer_minutes: data.bufferMinutes ?? null,
          total_duration_minutes: totalDuration > 0 ? totalDuration : null,
          min_advance_booking_hours: data.minAdvanceBookingHours ?? null,
          max_advance_booking_days: data.maxAdvanceBookingDays ?? null,
          created_by_id: session.user.id,
          updated_by_id: session.user.id,
        },
        { onConflict: 'service_id' },
      )

    if (upsertError) return { error: upsertError.message }

    revalidatePath('/business/services/booking-rules', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to save rule' }
  }
}
