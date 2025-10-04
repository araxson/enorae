'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const salonSettingsSchema = z.object({
  is_accepting_bookings: z.boolean(),
  booking_lead_time_hours: z.number().int().min(0).max(720).nullable(),
  cancellation_hours: z.number().int().min(0).max(168).nullable(),
  max_bookings_per_day: z.number().int().min(1).max(1000).nullable(),
  max_services: z.number().int().min(1).max(100).nullable(),
  max_staff: z.number().int().min(1).max(500).nullable(),
  subscription_tier: z.enum(['free', 'basic', 'premium', 'enterprise']).nullable(),
  features: z.array(z.string()).nullable(),
})

export async function updateSalonSettings(salonId: string, formData: FormData) {
  try {
    // SECURITY: Require business user role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const supabase = await createClient()

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', salonId)
      .single<{ owner_id: string | null }>()

    if (!salon || salon.owner_id !== session.user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Parse features from JSON
    let features = null
    try {
      const featuresJson = formData.get('features') as string
      if (featuresJson) {
        features = JSON.parse(featuresJson)
      }
    } catch {
      // Ignore JSON parse errors
    }

    // Validate input
    const validated = salonSettingsSchema.parse({
      is_accepting_bookings: formData.get('is_accepting_bookings') === 'true',
      booking_lead_time_hours: formData.get('booking_lead_time_hours')
        ? Number(formData.get('booking_lead_time_hours'))
        : null,
      cancellation_hours: formData.get('cancellation_hours')
        ? Number(formData.get('cancellation_hours'))
        : null,
      max_bookings_per_day: formData.get('max_bookings_per_day')
        ? Number(formData.get('max_bookings_per_day'))
        : null,
      max_services: formData.get('max_services') ? Number(formData.get('max_services')) : null,
      max_staff: formData.get('max_staff') ? Number(formData.get('max_staff')) : null,
      subscription_tier: (formData.get('subscription_tier') as string) || null,
      features,
    })

    // Check if settings exist
    const { data: existing } = await supabase
      .schema('organization')
      .from('salon_settings')
      .select('salon_id')
      .eq('salon_id', salonId)
      .single()

    if (existing) {
      // Update existing settings
      const { error } = await supabase
        .schema('organization')
        .from('salon_settings')
        .update({
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .eq('salon_id', salonId)

      if (error) throw error
    } else {
      // Insert new settings
      const { error } = await supabase
        .schema('organization')
        .from('salon_settings')
        .insert({
          ...validated,
          salon_id: salonId,
        })

      if (error) throw error
    }

    revalidatePath('/business/settings')
    revalidatePath('/business/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error updating salon settings:', error)
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed: ' + error.errors[0]?.message }
    }
    return { error: 'Failed to update salon settings' }
  }
}

export async function toggleAcceptingBookings(salonId: string, isAccepting: boolean) {
  try {
    // SECURITY: Require business user role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const supabase = await createClient()

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', salonId)
      .single<{ owner_id: string | null }>()

    if (!salon || salon.owner_id !== session.user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Update setting
    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        is_accepting_bookings: isAccepting,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/settings')
    revalidatePath('/business/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error toggling bookings:', error)
    return { error: 'Failed to update booking status' }
  }
}
