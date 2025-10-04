'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only


// UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Validation schema
const resolveAlertSchema = z.object({
  alertId: z.string().regex(UUID_REGEX, 'Invalid alert ID format'),
})

/**
 * Resolve a stock alert
 */
export async function resolveStockAlert(formData: FormData) {
  try {
    // Validate input
    const result = resolveAlertSchema.safeParse({
      alertId: formData.get('alertId'),
    })

    if (!result.success) {
      return {
        error: result.error.errors[0].message,
      }
    }

    const { alertId } = result.data

    // Create Supabase client
    const supabase = await createClient()

    // Auth check
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    if (!session.user) {
      return { error: 'Unauthorized' }
    }

    // Get user's salon_id from staff_profiles
    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) {
      return { error: 'User salon not found' }
    }

    // Get alert with product to verify ownership
    const { data: alert, error: getError } = await supabase
      .schema('inventory')
      .from('stock_alerts')
      .select(`
        id,
        product:products!fk_stock_alerts_product(
          salon_id
        )
      `)
      .eq('id', alertId)
      .single<{ id: string; product: { salon_id: string } | null }>()

    if (getError) {
      return { error: 'Alert not found' }
    }

    // Verify ownership via product salon_id
    if (alert.product?.salon_id !== staffProfile.salon_id) {
      return { error: 'Unauthorized: Alert not found for your salon' }
    }

    // Resolve the alert
    const { error: updateError } = await supabase
      .schema('inventory')
      .from('stock_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by_id: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', alertId)

    if (updateError) {
      return { error: updateError.message }
    }

    // Revalidate paths
    revalidatePath('/business/inventory/alerts')
    revalidatePath('/business/inventory')

    return { success: true }
  } catch (error) {
    console.error('Error resolving stock alert:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to resolve alert',
    }
  }
}

/**
 * Unresolve a stock alert
 */
export async function unresolveStockAlert(formData: FormData) {
  try {
    // Validate input
    const result = resolveAlertSchema.safeParse({
      alertId: formData.get('alertId'),
    })

    if (!result.success) {
      return {
        error: result.error.errors[0].message,
      }
    }

    const { alertId } = result.data

    // Create Supabase client
    const supabase = await createClient()

    // Auth check
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    if (!session.user) {
      return { error: 'Unauthorized' }
    }

    // Get user's salon_id from staff_profiles
    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) {
      return { error: 'User salon not found' }
    }

    // Get alert with product to verify ownership
    const { data: alert, error: getError } = await supabase
      .schema('inventory')
      .from('stock_alerts')
      .select(`
        id,
        product:products!fk_stock_alerts_product(
          salon_id
        )
      `)
      .eq('id', alertId)
      .single<{ id: string; product: { salon_id: string } | null }>()

    if (getError) {
      return { error: 'Alert not found' }
    }

    // Verify ownership via product salon_id
    if (alert.product?.salon_id !== staffProfile.salon_id) {
      return { error: 'Unauthorized: Alert not found for your salon' }
    }

    // Unresolve the alert
    const { error: updateError } = await supabase
      .schema('inventory')
      .from('stock_alerts')
      .update({
        is_resolved: false,
        resolved_at: null,
        resolved_by_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', alertId)

    if (updateError) {
      return { error: updateError.message }
    }

    // Revalidate paths
    revalidatePath('/business/inventory/alerts')
    revalidatePath('/business/inventory')

    return { success: true }
  } catch (error) {
    console.error('Error unresolving stock alert:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to unresolve alert',
    }
  }
}
