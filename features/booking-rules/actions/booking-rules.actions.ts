'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Note: service_booking_rules and staff_profiles don't have public views yet
// Keeping .schema() calls until public views are created for catalog tables

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const ruleSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX),
  durationMinutes: z.number().int().min(0).optional(),
  bufferMinutes: z.number().int().min(0).optional(),
  minAdvanceBookingHours: z.number().int().min(0).optional(),
  maxAdvanceBookingDays: z.number().int().min(0).optional(),
})

export async function upsertBookingRule(formData: FormData) {
  try {
    const result = ruleSchema.safeParse({
      serviceId: formData.get('serviceId'),
      durationMinutes: formData.get('durationMinutes') ? parseInt(formData.get('durationMinutes') as string) : undefined,
      bufferMinutes: formData.get('bufferMinutes') ? parseInt(formData.get('bufferMinutes') as string) : undefined,
      minAdvanceBookingHours: formData.get('minAdvanceBookingHours') ? parseInt(formData.get('minAdvanceBookingHours') as string) : undefined,
      maxAdvanceBookingDays: formData.get('maxAdvanceBookingDays') ? parseInt(formData.get('maxAdvanceBookingDays') as string) : undefined,
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // SECURITY: Verify the service belongs to user's salon
    const { data: service, error: serviceError } = await supabase
      .schema('catalog')
      .from('services')
      .select('salon_id')
      .eq('id', data.serviceId)
      .single()

    if (serviceError || !service) return { error: 'Service not found' }
    if (service.salon_id !== staffProfile.salon_id) {
      return { error: 'Unauthorized: Service not found for your salon' }
    }

    const totalDuration = (data.durationMinutes || 0) + (data.bufferMinutes || 0)

    const { error: upsertError } = await supabase
      .schema('catalog')
      .from('service_booking_rules')
      .upsert({
        service_id: data.serviceId,
        duration_minutes: data.durationMinutes || null,
        buffer_minutes: data.bufferMinutes || null,
        total_duration_minutes: totalDuration > 0 ? totalDuration : null,
        min_advance_booking_hours: data.minAdvanceBookingHours || null,
        max_advance_booking_days: data.maxAdvanceBookingDays || null,
        created_by_id: user.id,
        updated_by_id: user.id,
      })

    if (upsertError) return { error: upsertError.message }

    revalidatePath('/business/services/booking-rules')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to save rule' }
  }
}
