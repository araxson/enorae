'use server'

import { revalidatePath } from 'next/cache'
import { UUID_REGEX } from '../utils/schemas'
import { ensurePlatformAdmin, getSupabaseClient } from './shared'
import { sanitizeAdminText } from '@/features/admin/admin-common'

export async function transferSalonOwnership(formData: FormData) {
  try {
    const salonId = formData.get('salonId')?.toString()
    const newOwnerId = formData.get('newOwnerId')?.toString()
    const reason = sanitizeAdminText(formData.get('reason')?.toString(), 'No reason provided')

    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }
    if (!newOwnerId || !UUID_REGEX.test(newOwnerId)) {
      return { error: 'Invalid new owner ID' }
    }

    const session = await ensurePlatformAdmin()
    const supabase = await getSupabaseClient()

    const { data: existingSalon, error: fetchError } = await supabase
      .schema('organization')
      .from('salons')
      .select('owner_id')
      .eq('id', salonId)
      .maybeSingle()

    if (fetchError) {
      return { error: fetchError.message }
    }

    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update({
        owner_id: newOwnerId,
        updated_by_id: session.user.id,
      })
      .eq('id', salonId)

    if (error) return { error: error.message }

    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'salon_ownership_transferred',
      event_category: 'business',
      severity: 'warning',
      user_id: session.user.id,
      action: 'transfer_salon_ownership',
      entity_type: 'salon',
      entity_id: salonId,
      salon_id: salonId,
      target_schema: 'organization',
      target_table: 'salons',
      metadata: {
        old_owner_id: existingSalon?.owner_id ?? null,
        new_owner_id: newOwnerId,
        transferred_by: session.user.id,
        reason,
      },
      is_success: true,
    })

    revalidatePath('/admin/salons')
    return { success: true }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'Failed to transfer ownership',
    }
  }
}
