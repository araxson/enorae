'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { logSupabaseError } from '@/lib/supabase/errors'
import { enforceAdminBulkRateLimit } from '@/lib/rate-limit/admin-bulk'

import { logDashboardAudit } from './audit'
import type { ActionResponse } from './types'
import { BULK_ALERT_IDS_SCHEMA } from './validation'

export async function bulkResolveStockAlerts(
  formData: FormData,
): Promise<ActionResponse<{ resolved: number }>> {
  try {
    const alertIds = formData.get('alertIds')?.toString()
    if (!alertIds) {
      return { success: false, error: 'Alert IDs required' }
    }

    let ids: string[]
    try {
      const parsed = JSON.parse(alertIds)
      const validation = BULK_ALERT_IDS_SCHEMA.safeParse(parsed)
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.errors[0]?.message ?? 'Invalid alert IDs',
        }
      }
      ids = validation.data
    } catch {
      return { success: false, error: 'Invalid alert IDs payload' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    enforceAdminBulkRateLimit(session.user.id, 'dashboard:bulkResolveStockAlerts')

    const { error, count } = await supabase
      .schema('inventory')
      .from('stock_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
      })
      .in('id', ids)

    if (error) {
      logSupabaseError('bulkResolveStockAlerts', error)
      return { success: false, error: error.message }
    }

    await logDashboardAudit(supabase, session.user.id, 'bulk_stock_alerts_resolved', 'info', {
      total_requested: ids.length,
      resolved_count: count ?? 0,
    })

    revalidatePath('/admin')
    revalidatePath('/admin/inventory')
    return { success: true, data: { resolved: count || 0 } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resolve alerts',
    }
  }
}
