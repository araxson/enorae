'use server'

import { revalidatePath } from 'next/cache'
import { UUID_REGEX } from '../utils/schemas'
import { ensurePlatformAdmin, getSupabaseClient } from '../utils/supabase'

/**
 * Approve salon and make it live on the platform
 * Sets is_accepting_bookings to true and logs approval
 */
export async function approveSalon(formData: FormData) {
  try {
    const salonId = formData.get('salonId')?.toString()
    const note = formData.get('note')?.toString()

    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }

    const session = await ensurePlatformAdmin()
    const supabase = await getSupabaseClient()

    // Get salon owner for notification
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id, name')
      .eq('id', salonId)
      .single()

    if (!salon) {
      return { error: 'Salon not found' }
    }

    // Enable booking acceptance
    const { error: settingsError } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        is_accepting_bookings: true,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (settingsError) return { error: settingsError.message }

    // Ensure salon is not soft-deleted
    await supabase
      .schema('organization')
      .from('salons')
      .update({
        deleted_at: null,
        updated_by_id: session.user.id,
      })
      .eq('id', salonId)

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'salon_approved',
      event_category: 'business',
      severity: 'info',
      user_id: session.user.id,
      action: 'approve_salon',
      entity_type: 'salon',
      entity_id: salonId,
      salon_id: salonId,
      metadata: {
        salon_name: salon.name,
        note: note || 'Salon approved for platform listing',
        approved_by: session.user.id,
      },
      is_success: true,
    })

    // TODO: Send notification to salon owner when notification system is ready
    // await supabase.rpc('communication.send_notification', {
    //   p_user_id: salon.owner_id,
    //   p_type: 'salon_approved',
    //   p_title: 'Salon Approved',
    //   p_message: 'Your salon has been verified and is now live',
    //   p_data: { salon_id: salonId }
    // })

    revalidatePath('/admin/salons')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to approve salon',
    }
  }
}
