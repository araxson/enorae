import 'server-only'
import { createClient } from '@/lib/supabase/server'

/**
 * Refresh service performance analytics
 * Note: Since the RPC doesn't exist, we return true as analytics are calculated on-demand
 */
export async function refreshServicePerformance(serviceId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

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
