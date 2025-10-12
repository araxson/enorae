import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { canAccessSalon } from '@/lib/auth/permissions/salon-access'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from './helpers'

export async function resolveStockAlertMutation(alertId: string): Promise<ActionResult> {
  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    if (!(await canAccessSalon(salonId))) {
      throw new Error('Unauthorized')
    }

    const supabase = await createClient()

    const { error } = await supabase
      .schema('inventory')
      .from('stock_alerts')
      .update({ resolved_at: new Date().toISOString() })
      .eq('id', alertId)
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/inventory')

    return { success: true }
  } catch (error) {
    console.error('Error resolving stock alert:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to resolve stock alert',
    }
  }
}
