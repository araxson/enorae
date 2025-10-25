import 'server-only'

import { revalidatePath } from 'next/cache'
import { UUID_REGEX } from '@/features/admin/salons/api/utils/schemas'
import { ensurePlatformAdmin, getSupabaseClient } from '@/features/admin/salons/api/mutations/shared'

/**
 * Reactivate salon - enables bookings and restores to active status
 */
export async function reactivateSalon(formData: FormData) {
  try {
    const salonId = formData.get('salonId')?.toString()
    const note = formData.get('note')?.toString()

    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }

    const session = await ensurePlatformAdmin()
    const supabase = await getSupabaseClient()

    // Get salon info
    const { data: salon } = await supabase
      .from('salons_view')
      .select('name')
      .eq('id', salonId)
      .single()

    if (!salon) {
      return { error: 'Salon not found' }
    }

    const timestamp = new Date().toISOString()

    // Reactivate salon
    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update({
        deleted_at: null,
        updated_by_id: session.user.id,
        updated_at: timestamp,
      })
      .eq('id', salonId)

    if (error) return { error: error.message }

    // Enable bookings
    await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        is_accepting_bookings: true,
        updated_at: timestamp,
      })
      .eq('salon_id', salonId)

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'salon_reactivated',
      event_category: 'business',
      severity: 'info',
      user_id: session.user.id,
      action: 'reactivate_salon',
      entity_type: 'salon',
      entity_id: salonId,
      salon_id: salonId,
      target_schema: 'organization',
      target_table: 'salons',
      metadata: {
        salon_name: salon.name,
        note: note || 'Salon reactivated',
        reactivated_by: session.user.id,
      },
      is_success: true,
    })

    revalidatePath('/admin/salons')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to reactivate salon',
    }
  }
}
