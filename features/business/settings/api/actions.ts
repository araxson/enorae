'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getSalonContext, revalidateSettings } from './mutations/helpers'
import { salonSettingsSchema } from './schema'
import { createOperationLogger } from '@/lib/observability'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

type FormState = {
  message?: string
  errors?: Record<string, string[]>
  success?: boolean
}

/**
 * Server Action for updating salon settings
 * Uses Zod validation and audit logging for business-critical changes
 */
export async function updateSalonSettingsAction(
  salonId: string,
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const logger = createOperationLogger('updateSalonSettingsAction', { salonId })
  logger.start()

  try {
    // SECURITY: Require business user role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Parse and validate form data
    const parsed = salonSettingsSchema.safeParse({
      is_accepting_bookings: formData.get('is_accepting_bookings') === 'true',
      booking_lead_time_hours: formData.get('booking_lead_time_hours')
        ? Number(formData.get('booking_lead_time_hours'))
        : undefined,
      cancellation_window_hours: formData.get('cancellation_window_hours')
        ? Number(formData.get('cancellation_window_hours'))
        : undefined,
      max_bookings_per_day: formData.get('max_bookings_per_day')
        ? Number(formData.get('max_bookings_per_day'))
        : undefined,
      max_services: formData.get('max_services')
        ? Number(formData.get('max_services'))
        : undefined,
      max_staff_members: formData.get('max_staff_members')
        ? Number(formData.get('max_staff_members'))
        : undefined,
      max_locations: formData.get('max_locations')
        ? Number(formData.get('max_locations'))
        : undefined,
      allow_same_day_booking: formData.get('allow_same_day_booking') === 'true',
      require_deposit: formData.get('require_deposit') === 'true',
      deposit_percentage: formData.get('deposit_percentage')
        ? Number(formData.get('deposit_percentage'))
        : undefined,
      refund_percentage: formData.get('refund_percentage')
        ? Number(formData.get('refund_percentage'))
        : undefined,
      no_show_fee: formData.get('no_show_fee')
        ? Number(formData.get('no_show_fee'))
        : undefined,
      late_cancellation_fee: formData.get('late_cancellation_fee')
        ? Number(formData.get('late_cancellation_fee'))
        : undefined,
      booking_pause_reason: ((): string | undefined => {
        const value = formData.get('booking_pause_reason')
        return typeof value === 'string' ? value : undefined
      })(),
      booking_pause_until: ((): string | undefined => {
        const value = formData.get('booking_pause_until')
        return typeof value === 'string' ? value : undefined
      })(),
    })

    if (!parsed.success) {
      return {
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
        success: false,
      }
    }

    const salonContext = await getSalonContext(salonId)

    if (salonContext.error) {
      return {
        message: salonContext.error,
        errors: {},
        success: false,
      }
    }

    const { supabase } = salonContext
    if (!supabase) {
      return {
        message: 'Database connection unavailable',
        errors: {},
        success: false,
      }
    }

    // Get old settings for audit logging
    const { data: oldSettings } = await supabase
      .schema('organization')
      .from('salon_settings')
      .select('id, salon_id, booking_settings, cancellation_settings, payment_settings, notification_settings, created_at, updated_at')
      .eq('salon_id', salonId)
      .maybeSingle()

    // Map validated data to database schema
    const updatePayload = {
      is_accepting_bookings: parsed.data.is_accepting_bookings,
      booking_lead_time_hours: parsed.data.booking_lead_time_hours ?? null,
      cancellation_hours: parsed.data.cancellation_window_hours ?? null,
      max_bookings_per_day: parsed.data.max_bookings_per_day ?? null,
      max_services: parsed.data.max_services ?? null,
      max_staff: parsed.data.max_staff_members ?? null,
      updated_at: new Date().toISOString(),
    }

    // Check if settings exist
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
        .update(updatePayload)
        .eq('salon_id', salonId)

      if (error) throw error
    } else {
      const { error } = await supabase
        .schema('organization')
        .from('salon_settings')
        .insert({
          ...updatePayload,
          salon_id: salonId,
        })

      if (error) throw error
    }

    // AUDIT LOG: Track business-critical settings changes
    if (oldSettings) {
      const changes: Record<string, { old: unknown; new: unknown }> = {}

      // Use bracket notation for index signature access
      const oldBookingAccepting = oldSettings['is_accepting_bookings'] as boolean | undefined
      const oldMaxBookings = oldSettings['max_bookings_per_day'] as number | null | undefined

      if (oldBookingAccepting !== updatePayload.is_accepting_bookings) {
        changes['is_accepting_bookings'] = {
          old: oldBookingAccepting,
          new: updatePayload.is_accepting_bookings,
        }
      }
      if (oldMaxBookings !== updatePayload.max_bookings_per_day) {
        changes['max_bookings_per_day'] = {
          old: oldMaxBookings,
          new: updatePayload.max_bookings_per_day,
        }
      }

      if (Object.keys(changes).length > 0) {
        // Log to organization audit_logs table
        await supabase.schema('organization').from('audit_logs').insert({
          user_id: session.user.id,
          action: 'salon_settings.update',
          resource_type: 'salon_settings',
          resource_id: salonId,
          changes: changes as unknown as Record<string, never>,
          created_at: new Date().toISOString(),
        })
      }
    }

    revalidateSettings()
    revalidatePath('/business/settings')

    logger.success({ message: 'Settings updated successfully' })

    return {
      message: 'Settings updated successfully',
      success: true,
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')

    return {
      message: error instanceof Error ? error.message : 'Failed to update settings',
      success: false,
    }
  }
}
