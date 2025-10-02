import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: salon_metrics doesn't have public view yet

type SalonMetric = Database['public']['Views']['salon_metrics']['Row']

export type SalonMetricsData = SalonMetric & {
  salon?: {
    id: string
    name: string
  } | null
}

/**
 * Get latest metrics for the user's salon
 */
export async function getLatestSalonMetrics(): Promise<SalonMetricsData | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('salon_metrics')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    // No metrics found yet
    if (error.code === 'PGRST116') return null
    throw error
  }

  // Get salon info
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name')
    .eq('id', staffProfile.salon_id)
    .single()

  return {
    ...data,
    salon,
  }
}

/**
 * Get metrics history for the user's salon
 */
export async function getSalonMetricsHistory(days = 30): Promise<SalonMetricsData[]> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  const { data, error } = await supabase
    .from('salon_metrics')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .gte('updated_at', cutoffDate.toISOString())
    .order('updated_at', { ascending: true })

  if (error) throw error

  // Get salon info
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name')
    .eq('id', staffProfile.salon_id)
    .single()

  return (data || []).map((metric) => ({
    ...metric,
    salon,
  }))
}
