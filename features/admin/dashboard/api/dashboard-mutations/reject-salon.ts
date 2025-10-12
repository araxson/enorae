'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { logSupabaseError } from '@/lib/supabase/errors'
import { sanitizeAdminText } from '@/features/admin/admin-common/utils/sanitize'

import { logDashboardAudit } from './audit'
import type { ActionResponse } from './types'

export async function rejectSalon(formData: FormData): Promise<ActionResponse> {
  try {
    const salonId = formData.get('salonId')?.toString()
    const rawReason = formData.get('reason')?.toString()
    const reason = sanitizeAdminText(rawReason, 'No reason provided')

    if (!salonId) {
      return { success: false, error: 'Salon ID required' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update({
        is_active: false,
        rejected_at: new Date().toISOString(),
        rejected_by_id: session.user.id,
        rejection_reason: reason,
      })
      .eq('id', salonId)

    if (error) {
      logSupabaseError('rejectSalon', error)
      return { success: false, error: error.message }
    }

    await logDashboardAudit(supabase, session.user.id, 'salon_rejected_admin', 'warning', {
      entity_id: salonId,
      reason,
    })

    revalidatePath('/admin')
    revalidatePath('/admin/salons')
    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reject salon',
    }
  }
}
