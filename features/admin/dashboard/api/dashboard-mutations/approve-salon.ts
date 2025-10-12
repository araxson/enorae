'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { logSupabaseError } from '@/lib/supabase/errors'

import { logDashboardAudit } from './audit'
import type { ActionResponse } from './types'

export async function approveSalon(formData: FormData): Promise<ActionResponse> {
  try {
    const salonId = formData.get('salonId')?.toString()
    if (!salonId) {
      return { success: false, error: 'Salon ID required' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verified_by_id: session.user.id,
      })
      .eq('id', salonId)

    if (error) {
      logSupabaseError('approveSalon', error)
      return { success: false, error: error.message }
    }

    await logDashboardAudit(supabase, session.user.id, 'salon_approved_admin', 'info', {
      entity_id: salonId,
    })

    revalidatePath('/admin')
    revalidatePath('/admin/salons')
    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve salon',
    }
  }
}
