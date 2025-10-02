import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: webhook_queue doesn't have public view yet

type WebhookQueue = Database['public']['Views']['webhook_queue']['Row']

/**
 * Get webhook queue entries for the user's salon
 */
export async function getWebhookQueue(limit = 100): Promise<WebhookQueue[]> {
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
    .from('webhook_queue')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Get single webhook queue entry by ID
 */
export async function getWebhookQueueById(
  id: string
): Promise<WebhookQueue | null> {
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
    .from('webhook_queue')
    .select('*')
    .eq('id', id)
    .eq('salon_id', staffProfile.salon_id)
    .single()

  if (error) throw error
  return data
}
