'use server'

import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth/guards-simple'
import { createOperationLogger } from '@/lib/observability'

/**
 * Refresh service performance analytics
 * Note: Since the RPC doesn't exist, we return true as analytics are calculated on-demand
 */
export async function refreshServicePerformance(serviceId: string): Promise<boolean> {
  const logger = createOperationLogger('refreshServicePerformance', {})
  logger.start()

  await requireUser()
  const supabase = await createClient()

  // Verify service exists and user has access
  const { error } = await supabase
    .schema('catalog')
    .from('services')
    .select('id')
    .eq('id', serviceId)
    .single()

  if (error) {
    console.error('[analytics] service verification error:', error)
    return false
  }

  // Analytics are calculated on-demand from views, no refresh needed
  return true
}
