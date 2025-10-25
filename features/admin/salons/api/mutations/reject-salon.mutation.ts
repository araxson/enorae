import 'server-only'

import { revalidatePath } from 'next/cache'
import { UUID_REGEX } from '@/features/admin/salons/api/utils/schemas'
import { ensurePlatformAdmin, getSupabaseClient } from '@/features/admin/salons/api/mutations/shared'

/**
 * Reject salon application
 * Disables bookings and marks as soft-deleted
 */
export async function rejectSalon(formData: FormData) {
  try {
    const salonId = formData.get('salonId')?.toString()
    const reason = formData.get('reason')?.toString()

    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }

    if (!reason) {
      return { error: 'Rejection reason is required' }
    }

    const session = await ensurePlatformAdmin()
    const supabase = await getSupabaseClient()

    // Get salon info for notification
    const { data: salon, error: fetchError } = await supabase
      .schema('organization')
      .from('salons')
      .select('name')
      .eq('id', salonId)
      .maybeSingle()

    if (fetchError) {
      return { error: fetchError.message }
    }

    if (!salon) {
      return { error: 'Salon not found' }
    }

    // Disable bookings
    await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        is_accepting_bookings: false,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    // Soft delete salon
    const { error: salonError } = await supabase
      .schema('organization')
      .from('salons')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', salonId)

    if (salonError) return { error: salonError.message }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'salon_rejected',
      event_category: 'business',
      severity: 'warning',
      user_id: session.user.id,
      action: 'reject_salon',
      entity_type: 'salon',
      entity_id: salonId,
      salon_id: salonId,
      target_schema: 'organization',
      target_table: 'salons',
      metadata: {
        salon_name: salon.name,
        reason,
        rejected_by: session.user.id,
      },
      is_success: true,
    })

    // TODO: Send notification to salon owner when notification system is ready
    // await supabase.rpc('communication.send_notification', {
    //   p_user_id: salon.owner_id,
    //   p_type: 'salon_rejected',
    //   p_title: 'Salon Application Rejected',
    //   p_message: reason,
    //   p_data: { salon_id: salonId }
    // })

    revalidatePath('/admin/salons')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to reject salon',
    }
  }
}
