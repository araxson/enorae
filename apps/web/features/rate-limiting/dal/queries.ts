import { createClient } from '@/lib/supabase/client'

export async function getRateLimits() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('user_id', user.id)

  if (error) throw error
  return data
}

export async function getRateLimitStatus(endpoint: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('rate_limit_tracking')
    .select('*')
    .eq('user_id', user.id)
    .eq('endpoint', endpoint)
    .gte('window_start', new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}