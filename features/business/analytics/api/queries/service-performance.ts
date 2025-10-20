import 'server-only'
import { createClient } from '@/lib/supabase/server'

/**
 * Refresh service performance materialized views
 * Note: This is a procedure that returns undefined - it updates views but doesn't return data
 */
export async function refreshServicePerformance(serviceId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('analytics')
    .rpc('refresh_service_performance', {
      p_service_id: serviceId,
    })

  if (error) {
    console.error('[analytics] refresh_service_performance error:', error)
    return false
  }

  // Function executed successfully (it's a procedure that updates materialized views)
  return true
}
