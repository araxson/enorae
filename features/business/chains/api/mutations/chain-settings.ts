'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const optionalBoundedInt = (max: number, fieldLabel: string) =>
  z
    .preprocess(
      (value) => {
        if (value === undefined || value === null) return undefined
        if (typeof value === 'string') {
          const trimmed = value.trim()
          if (trimmed === '') return undefined
          const parsed = Number(trimmed)
          return Number.isFinite(parsed) ? parsed : Number.NaN
        }
        if (typeof value === 'number') return value
        return Number.NaN
      },
      z
        .number()
        .int(`${fieldLabel} must be a whole number`)
        .min(0, `${fieldLabel} cannot be negative`)
        .max(max, `${fieldLabel} cannot exceed ${max}`),
    )
    .optional()

const optionalBoolean = z
  .preprocess((value) => {
    if (value === undefined || value === null) return undefined
    if (typeof value === 'string') {
      if (value.trim() === '') return undefined
      if (value === 'true') return true
      if (value === 'false') return false
    }
    if (typeof value === 'boolean') return value
    return value
  }, z.boolean({ invalid_type_error: 'isAcceptingBookings must be true or false' }))
  .optional()

const chainSettingsSchema = z.object({
  chainId: z.string().regex(UUID_REGEX, 'Invalid chain ID'),
  bookingLeadTimeHours: optionalBoundedInt(720, 'Booking lead time'),
  cancellationHours: optionalBoundedInt(168, 'Cancellation window'),
  isAcceptingBookings: optionalBoolean,
})

/**
 * Bulk update settings across all chain locations
 */
export async function updateChainSettings(formData: FormData) {
  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const payloadResult = chainSettingsSchema.safeParse({
      chainId: formData.get('chainId')?.toString(),
      bookingLeadTimeHours: formData.get('bookingLeadTimeHours')?.toString(),
      cancellationHours: formData.get('cancellationHours')?.toString(),
      isAcceptingBookings: formData.get('isAcceptingBookings')?.toString(),
    })

    if (!payloadResult.success) {
      return { error: payloadResult.error.errors[0]?.message ?? 'Invalid settings payload' }
    }

    const {
      chainId,
      bookingLeadTimeHours,
      cancellationHours,
      isAcceptingBookings,
    } = payloadResult.data

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // Verify ownership
    const { data: chain } = await supabase
      .from('salon_chains_view')
      .select('id')
      .eq('id', chainId)
      .eq('owner_id', user['id'])
      .single()

    if (!chain) return { error: 'Chain not found or access denied' }

    const updates: Record<string, unknown> = {
      updated_by_id: user['id'],
    }

    if (bookingLeadTimeHours !== undefined) {
      updates['booking_lead_time_hours'] = bookingLeadTimeHours
    }

    if (cancellationHours !== undefined) {
      updates['cancellation_hours'] = cancellationHours
    }

    if (isAcceptingBookings !== undefined) {
      updates['is_accepting_bookings'] = isAcceptingBookings
    }

    // Get all salons in chain
    const { data: salons } = await supabase
      .from('salons')
      .select('id')
      .eq('chain_id', chainId)
      .is('deleted_at', null)

    type SalonId = { id: string }
    const salonList = (salons || []) as SalonId[]

    if (salonList.length === 0) {
      return { error: 'No salons found in chain' }
    }

    const salonIds = salonList.map((s) => s['id'])

    // Update all salon settings
    const { error: updateError } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update(updates)
      .in('salon_id', salonIds)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/chains')
    return { success: true, updatedCount: salonList.length }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update settings' }
  }
}
