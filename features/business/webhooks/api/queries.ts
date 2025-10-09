import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'


type WebhookQueue = Database['communication']['Tables']['webhook_queue']['Row']

/**
 * Get webhook queue entries for the user's salon
 */
export async function getWebhookQueue(limit = 100): Promise<WebhookQueue[]> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = (await createClient()).schema('communication')

  // Explicit salon filter for security
  const { data, error } = await supabase
    .from('webhook_queue')
    .select('*')
    .eq('salon_id', salonId)
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
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = (await createClient()).schema('communication')

  // Explicit salon and ID filters for security
  const { data, error } = await supabase
    .from('webhook_queue')
    .select('*')
    .eq('id', id)
    .eq('salon_id', salonId)
    .single()

  if (error) throw error
  return data
}
