'use server'
import 'server-only'

import { z } from 'zod'
import { getSalonContext, revalidateSettings } from './helpers'
import type { ServerSupabaseClient } from '@/lib/supabase/server'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'
import { safeJsonParseStringArray } from '@/lib/utils/safe-json'

type Client = ServerSupabaseClient

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

const featuresArraySchema = z.array(z.string())

function parseFeatures(raw: FormDataEntryValue | null): string[] | null {
  if (!raw) return null
  const parsed = safeJsonParseStringArray(String(raw), [])
  const validated = featuresArraySchema.safeParse(parsed)
  return validated.success ? validated.data : null
}

async function upsertSalonSettings(
  supabase: Client,
  salonId: string,
  payload: z.infer<typeof salonSettingsSchema>,
): Promise<{ success: true } | { success: false; error: string }> {
  const { data: existing } = await supabase
    .schema('organization')
    .from('salon_settings')
    .select('salon_id')
    .eq('salon_id', salonId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (error) {
      console.error('Error updating salon settings:', error)
      return { success: false, error: 'Failed to update salon settings' }
    }
  } else {
    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .insert({
        ...payload,
        salon_id: salonId,
      })

    if (error) {
      console.error('Error inserting salon settings:', error)
      return { success: false, error: 'Failed to create salon settings' }
    }
  }

  return { success: true }
}

function extractSalonSettings(formData: FormData):
  | { success: true; data: z.infer<typeof salonSettingsSchema> }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> } {
  const result = salonSettingsSchema.safeParse({
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
    max_services: formData.get('max_services')
      ? Number(formData.get('max_services'))
      : null,
    max_staff: formData.get('max_staff')
      ? Number(formData.get('max_staff'))
      : null,
    subscription_tier: (formData.get('subscription_tier') as string) || null,
    features: parseFeatures(formData.get('features')),
  })

  if (!result.success) {
    return {
      success: false,
      error: 'Validation failed. Please check your input.',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  return { success: true, data: result.data }
}

export async function updateSalonSettings(salonId: string, formData: FormData) {
  const logger = createOperationLogger('updateSalonSettings', {})
  logger.start()

  try {
    const salonContext = await getSalonContext(salonId)

    if (salonContext.error || !salonContext.supabase) {
      return { error: salonContext.error || 'Database connection unavailable' }
    }

    const supabase = salonContext.supabase
    const validationResult = extractSalonSettings(formData)

    if (!validationResult.success) {
      logger.error('Validation failed', 'validation')
      return {
        error: validationResult.error,
        fieldErrors: validationResult.fieldErrors
      }
    }

    const upsertResult = await upsertSalonSettings(supabase, salonId, validationResult.data)

    if (!upsertResult.success) {
      logger.error('Database operation failed', 'database')
      return { error: upsertResult.error }
    }

    revalidateSettings()

    return { success: true }
  } catch (error: unknown) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: 'Failed to update salon settings' }
  }
}

export async function toggleAcceptingBookings(
  salonId: string,
  isAccepting: boolean,
) {
  const logger = createOperationLogger('toggleAcceptingBookings', { salonId })
  logger.start()

  try {
    const salonContext = await getSalonContext(salonId)

    if (salonContext.error || !salonContext.supabase) {
      return { error: salonContext.error || 'Database connection unavailable' }
    }

    const supabase = salonContext.supabase

    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        is_accepting_bookings: isAccepting,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (error) {
      console.error('Error toggling booking status:', error)
      logger.error('Database operation failed', 'database')
      return { error: 'Failed to update booking status' }
    }

    revalidateSettings()
    return { success: true }
  } catch (error: unknown) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: 'Failed to update booking status' }
  }
}

export async function toggleFeature(
  salonId: string,
  feature: string,
  enabled: boolean,
) {
  const logger = createOperationLogger('toggleFeature', { salonId })
  logger.start()

  try {
    const salonContext = await getSalonContext(salonId)

    if (salonContext.error || !salonContext.supabase) {
      return { error: salonContext.error || 'Database connection unavailable' }
    }

    const supabase = salonContext.supabase

    const { data: settings, error: fetchError } = await supabase
      .schema('organization')
      .from('salon_settings')
      .select('features')
      .eq('salon_id', salonId)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching salon settings:', fetchError)
      logger.error('Database fetch failed', 'database')
      return { error: 'Failed to fetch current settings' }
    }

    let features: string[] = Array.isArray(settings?.features)
      ? [...settings.features]
      : []

    if (enabled) {
      if (!features.includes(feature)) {
        features.push(feature)
      }
    } else {
      features = features.filter((existing) => existing !== feature)
    }

    const { error: updateError } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        features,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (updateError) {
      console.error('Error updating features:', updateError)
      logger.error('Database update failed', 'database')
      return { error: 'Failed to toggle feature' }
    }

    revalidateSettings()
    return { success: true }
  } catch (error: unknown) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: 'Failed to toggle feature' }
  }
}
