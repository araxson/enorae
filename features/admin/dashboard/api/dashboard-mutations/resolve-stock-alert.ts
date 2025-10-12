'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { logSupabaseError } from '@/lib/supabase/errors'

import { logDashboardAudit } from './audit'
import type { ActionResponse } from './types'

export async function resolveStockAlert(formData: FormData): Promise<ActionResponse> {
  try {
    const alertId = formData.get('alertId')?.toString()
    if (!alertId) {
      return { success: false, error: 'Alert ID required' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .schema('inventory')
      .from('stock_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', alertId)

    if (error) {
      logSupabaseError('resolveStockAlert', error)
      return { success: false, error: error.message }
    }

    await logDashboardAudit(supabase, session.user.id, 'stock_alert_resolved', 'info', {
      alert_id: alertId,
    })

    revalidatePath('/admin')
    revalidatePath('/admin/inventory')
    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resolve alert',
    }
  }
}
