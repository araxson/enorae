import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

export interface WebhookStats {
  total_webhooks: number
  successful_deliveries: number
  failed_deliveries: number
  pending_deliveries: number
  success_rate: number
  avg_delivery_time: number
}

export type WebhookDeliveryLog = {
  id: string
  webhook_id: string
  status: string
  created_at: string | null
  delivered_at: string | null
  delivery_time_ms: number | null
  response_code: number | null
  response_body: string | null
  error_message: string | null
}

export async function getWebhookStats(): Promise<WebhookStats> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('communication_webhook_queue')
    .select('status, delivery_time_ms')
    .eq('salon_id', salonId)

  if (error) throw error

  const total = data.length
  const successful = data.filter(w => w.status === 'delivered').length
  const failed = data.filter(w => w.status === 'failed').length
  const pending = data.filter(w => w.status === 'pending').length

  const successfulWithTime = data.filter(
    w => w.status === 'delivered' && w.delivery_time_ms
  )
  const avgTime = successfulWithTime.length > 0
    ? successfulWithTime.reduce((sum, w) => sum + (w.delivery_time_ms || 0), 0) / successfulWithTime.length
    : 0

  return {
    total_webhooks: total,
    successful_deliveries: successful,
    failed_deliveries: failed,
    pending_deliveries: pending,
    success_rate: total > 0 ? (successful / total) * 100 : 0,
    avg_delivery_time: avgTime,
  }
}

export async function getWebhookDeliveryLogs(webhookId: string, limit = 50): Promise<WebhookDeliveryLog[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Use communication_webhook_queue table since delivery_logs view doesn't exist yet
  // This table contains delivery attempts with status and timing information
  const { data, error } = await supabase
    .from('communication_webhook_queue')
    .select('*')
    .eq('webhook_config_id', webhookId)
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  // Map queue data to WebhookDeliveryLog format
  return (data || []).map(item => ({
    id: item.id,
    webhook_id: item.webhook_config_id || webhookId,
    status: item.status || 'unknown',
    created_at: item.created_at,
    delivered_at: item.delivered_at || null,
    delivery_time_ms: item.delivery_time_ms || null,
    response_code: null, // Not stored in queue table
    response_body: null, // Not stored in queue table
    error_message: item.error_message || null,
  }))
}

export async function getFailedWebhooks(limit = 50) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('communication_webhook_queue')
    .select('*')
    .eq('salon_id', salonId)
    .eq('status', 'failed')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
