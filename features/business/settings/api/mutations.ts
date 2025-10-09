'use server'

import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
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
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const supabase = await createClient()

    if (!(await canAccessSalon(salonId))) {
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
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const supabase = await createClient()

    if (!(await canAccessSalon(salonId))) {
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

export async function toggleFeature(salonId: string, feature: string, enabled: boolean) {
  try {
    // SECURITY: Require business user role
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const supabase = await createClient()

    if (!(await canAccessSalon(salonId))) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Get current features
    const { data: settings } = await supabase
      .schema('organization')
      .from('salon_settings')
      .select('features')
      .eq('salon_id', salonId)
      .single()

    let updatedFeatures = settings?.features || []

    if (enabled) {
      // Add feature if not already present
      if (!updatedFeatures.includes(feature)) {
        updatedFeatures = [...updatedFeatures, feature]
      }
    } else {
      // Remove feature
      updatedFeatures = updatedFeatures.filter((f: string) => f !== feature)
    }

    // Update setting
    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        features: updatedFeatures,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/settings')

    return { success: true }
  } catch (error) {
    console.error('Error toggling feature:', error)
    return { error: 'Failed to toggle feature' }
  }
}

const bookingRulesSchema = z.object({
  booking_lead_time_hours: z.number().int().min(0).max(720).optional(),
  max_bookings_per_day: z.number().int().min(1).max(1000).optional(),
  max_services: z.number().int().min(1).max(100).optional(),
  allow_same_day_booking: z.boolean().optional(),
  require_deposit: z.boolean().optional(),
  deposit_percentage: z.number().min(0).max(100).optional(),
})

export async function updateBookingRules(salonId: string, formData: FormData) {
  try {
    // SECURITY: Require business user role
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const supabase = await createClient()

    if (!(await canAccessSalon(salonId))) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Validate input
    const validated = bookingRulesSchema.parse({
      booking_lead_time_hours: formData.get('booking_lead_time_hours')
        ? Number(formData.get('booking_lead_time_hours'))
        : undefined,
      max_bookings_per_day: formData.get('max_bookings_per_day')
        ? Number(formData.get('max_bookings_per_day'))
        : undefined,
      max_services: formData.get('max_services') ? Number(formData.get('max_services')) : undefined,
      allow_same_day_booking: formData.get('allow_same_day_booking') === 'true',
      require_deposit: formData.get('require_deposit') === 'true',
      deposit_percentage: formData.get('deposit_percentage')
        ? Number(formData.get('deposit_percentage'))
        : undefined,
    })

    // Update settings
    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/settings')

    return { success: true }
  } catch (error) {
    console.error('Error updating booking rules:', error)
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed: ' + error.errors[0]?.message }
    }
    return { error: 'Failed to update booking rules' }
  }
}

const cancellationPolicySchema = z.object({
  cancellation_hours: z.number().int().min(0).max(168),
  cancellation_fee_percentage: z.number().min(0).max(100).optional(),
  no_show_fee_percentage: z.number().min(0).max(100).optional(),
})

export async function updateCancellationPolicy(salonId: string, formData: FormData) {
  try {
    // SECURITY: Require business user role
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const supabase = await createClient()

    if (!(await canAccessSalon(salonId))) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Validate input
    const validated = cancellationPolicySchema.parse({
      cancellation_hours: Number(formData.get('cancellation_hours')),
      cancellation_fee_percentage: formData.get('cancellation_fee_percentage')
        ? Number(formData.get('cancellation_fee_percentage'))
        : undefined,
      no_show_fee_percentage: formData.get('no_show_fee_percentage')
        ? Number(formData.get('no_show_fee_percentage'))
        : undefined,
    })

    // Update settings
    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/settings')

    return { success: true }
  } catch (error) {
    console.error('Error updating cancellation policy:', error)
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed: ' + error.errors[0]?.message }
    }
    return { error: 'Failed to update cancellation policy' }
  }
}

const paymentMethodsSchema = z.object({
  payment_methods: z.array(z.string()).min(1),
})

export async function updatePaymentMethods(salonId: string, formData: FormData) {
  try {
    // SECURITY: Require business user role
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const supabase = await createClient()

    if (!(await canAccessSalon(salonId))) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Parse payment methods from JSON
    let paymentMethods: string[] = []
    try {
      const methodsJson = formData.get('payment_methods') as string
      if (methodsJson) {
        paymentMethods = JSON.parse(methodsJson)
      }
    } catch {
      return { error: 'Invalid payment methods format' }
    }

    // Validate input
    const validated = paymentMethodsSchema.parse({
      payment_methods: paymentMethods,
    })

    // Update settings
    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/settings')

    return { success: true }
  } catch (error) {
    console.error('Error updating payment methods:', error)
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed: ' + error.errors[0]?.message }
    }
    return { error: 'Failed to update payment methods' }
  }
}
