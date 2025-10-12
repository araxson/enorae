'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const chainSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  legal_name: z.string().max(200).optional().or(z.literal('')),
})

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

export async function createSalonChain(formData: FormData) {
  try {
    // SECURITY: Business users only
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const result = chainSchema.safeParse({
      name: formData.get('name'),
      legal_name: formData.get('legal_name'),
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { error: insertError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .insert({
        id: crypto.randomUUID(),
        owner_id: user.id,
        name: data.name,
        legal_name: data.legal_name || null,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        created_by_id: user.id,
        updated_by_id: user.id,
      })

    if (insertError) return { error: insertError.message }

    revalidatePath('/admin/chains')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create chain' }
  }
}

export async function updateSalonChain(formData: FormData) {
  try {
    // SECURITY: Business users only
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const result = chainSchema.safeParse({
      name: formData.get('name'),
      legal_name: formData.get('legal_name'),
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { error: updateError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .update({
        name: data.name,
        legal_name: data.legal_name || null,
        updated_by_id: user.id,
      })
      .eq('id', id)
      .eq('owner_id', user.id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/admin/chains')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update chain' }
  }
}

export async function deleteSalonChain(formData: FormData) {
  try {
    // SECURITY: Business users only
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // Check if chain has salons
    const { count } = await supabase
      .schema('organization')
      .from('salons')
      .select('*', { count: 'exact', head: true })
      .eq('chain_id', id)
      .is('deleted_at', null)

    if (count && count > 0) {
      return { error: `Cannot delete chain with ${count} active salon(s)` }
    }

    const { error: deleteError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by_id: user.id,
      })
      .eq('id', id)
      .eq('owner_id', user.id)

    if (deleteError) return { error: deleteError.message }

    revalidatePath('/business/chains')
    revalidatePath('/admin/chains')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete chain' }
  }
}

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
      .eq('owner_id', user.id)
      .single()

    if (!chain) return { error: 'Chain not found or access denied' }

    const updates: Record<string, unknown> = {
      updated_by_id: user.id,
    }

    if (bookingLeadTimeHours !== undefined) {
      updates.booking_lead_time_hours = bookingLeadTimeHours
    }

    if (cancellationHours !== undefined) {
      updates.cancellation_hours = cancellationHours
    }

    if (isAcceptingBookings !== undefined) {
      updates.is_accepting_bookings = isAcceptingBookings
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

    const salonIds = salonList.map((s) => s.id)

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

/**
 * Assign/reassign a salon to a chain
 */
export async function assignSalonToChain(formData: FormData) {
  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = formData.get('salonId')?.toString()
    const chainId = formData.get('chainId')?.toString()

    if (!salonId || !UUID_REGEX.test(salonId)) return { error: 'Invalid salon ID' }
    if (chainId && !UUID_REGEX.test(chainId)) return { error: 'Invalid chain ID' }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('id, owner_id')
      .eq('id', salonId)
      .eq('owner_id', user.id)
      .single()

    if (!salon) return { error: 'Salon not found or access denied' }

    // If chainId provided, verify chain ownership
    if (chainId) {
      const { data: chain } = await supabase
        .from('salon_chains_view')
        .select('id')
        .eq('id', chainId)
        .eq('owner_id', user.id)
        .single()

      if (!chain) return { error: 'Chain not found or access denied' }
    }

    // Update salon's chain assignment
    const { error: updateError } = await supabase
      .schema('organization')
      .from('salons')
      .update({
        chain_id: chainId || null,
        updated_by_id: user.id,
      })
      .eq('id', salonId)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/chains')
    revalidatePath('/business')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to assign salon' }
  }
}
