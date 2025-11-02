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
) {
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

    if (error) throw error
  } else {
    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .insert({
        ...payload,
        salon_id: salonId,
      })

    if (error) throw error
  }
}

function extractSalonSettings(formData: FormData) {
  return salonSettingsSchema.parse({
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
}

export async function updateSalonSettings(salonId: string, formData: FormData) {
  const logger = createOperationLogger('updateSalonSettings', {})
  logger.start()

  try {
    const supabase = await getSalonContext(salonId)
    const validated = extractSalonSettings(formData)

    await upsertSalonSettings(supabase, salonId, validated)

    revalidateSettings()

    return { success: true }
  } catch (error: unknown) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    if (error instanceof z.ZodError) {
      return { error: `Validation failed: ${error.issues[0]?.message}` }
    }
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
    const supabase = await getSalonContext(salonId)

    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        is_accepting_bookings: isAccepting,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (error) throw error

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
    const supabase = await getSalonContext(salonId)

    const { data: settings, error: fetchError } = await supabase
      .schema('organization')
      .from('salon_settings')
      .select('features')
      .eq('salon_id', salonId)
      .maybeSingle()

    if (fetchError) throw fetchError

    let features: string[] = Array.isArray(settings?.features)
      ? [...settings!.features]
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

    if (updateError) throw updateError

    revalidateSettings()
    return { success: true }
  } catch (error: unknown) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: 'Failed to toggle feature' }
  }
}
