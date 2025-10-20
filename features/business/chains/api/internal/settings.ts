'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { chainSettingsSchema, UUID_REGEX } from './schemas'

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

    const { data: salon } = await supabase
      .from('salons')
      .select('id, owner_id')
      .eq('id', salonId)
      .eq('owner_id', user.id)
      .single()

    if (!salon) return { error: 'Salon not found or access denied' }

    if (chainId) {
      const { data: chain } = await supabase
        .from('salon_chains_view')
        .select('id')
        .eq('id', chainId)
        .eq('owner_id', user.id)
        .single()

      if (!chain) return { error: 'Chain not found or access denied' }
    }

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
