import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { createOperationLogger } from '@/lib/observability/logger'

export interface CustomerMetrics {
  upcomingAppointments: number
  completedAppointments: number
  favorites: number
}

export async function getCustomerMetrics(): Promise<CustomerMetrics> {
  const logger = createOperationLogger('getCustomerMetrics', {})
  logger.start()

  const session = await requireAuth()
  const supabase = await createClient()
  const now = new Date().toISOString()

  const [
    { count: upcomingCount },
    { count: completedCount },
    { count: favoritesCount },
  ] = await Promise.all([
    supabase
      .from('appointments_view')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', session.user.id)
      .gte('start_time', now),
    supabase
      .from('appointments_view')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', session.user.id)
      .eq('status', 'completed'),
    supabase
      .from('customer_favorites_view')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', session.user.id),
  ])

  return {
    upcomingAppointments: upcomingCount || 0,
    completedAppointments: completedCount || 0,
    favorites: favoritesCount || 0,
  }
}
