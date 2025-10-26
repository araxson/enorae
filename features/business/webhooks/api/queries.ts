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

  type WebhookQueueRow = {
    id: string | null
    status: string | null
    created_at: string | null
    completed_at: string | null
  }

  const { data, error } = await supabase
    .from('communication_webhook_queue')
    .select('id, status, created_at, completed_at')
    .returns<WebhookQueueRow[]>()

  if (error) throw error

  const webhooks = data || []
  const total = webhooks.length
  const successful = webhooks.filter(w => w.status === 'completed').length
  const failed = webhooks.filter(w => w.status === 'failed').length
  const pending = webhooks.filter(w => w.status === 'pending').length

  // Calculate average delivery time from created_at to completed_at
  const successfulWithTime = webhooks.filter(
    w => w.status === 'completed' && w.created_at && w.completed_at
  )
  const avgTime = successfulWithTime.length > 0
    ? successfulWithTime.reduce((sum, w) => {
        const start = new Date(w.created_at!).getTime()
        const end = new Date(w.completed_at!).getTime()
        return sum + (end - start)
      }, 0) / successfulWithTime.length
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

  type WebhookQueueRow = {
    id: string | null
    status: string | null
    created_at: string | null
    completed_at: string | null
    last_error: string | null
    attempts: number | null
  }

  // Use communication_webhook_queue table since delivery_logs view doesn't exist yet
  // This table contains delivery attempts with status and timing information
  const { data, error } = await supabase
    .from('communication_webhook_queue')
    .select('id, status, created_at, completed_at, last_error, attempts')
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<WebhookQueueRow[]>()

  if (error) throw error

  // Map queue data to WebhookDeliveryLog format
  return (data || []).map(item => {
    const createdAt = item.created_at ? new Date(item.created_at).getTime() : 0
    const completedAt = item.completed_at ? new Date(item.completed_at).getTime() : 0
    const deliveryTimeMs = completedAt && createdAt ? completedAt - createdAt : null

    return {
      id: item.id || '',
      webhook_id: webhookId,
      status: item.status || 'unknown',
      created_at: item.created_at,
      delivered_at: item.completed_at,
      delivery_time_ms: deliveryTimeMs,
      response_code: null, // Not stored in queue table
      response_body: null, // Not stored in queue table
      error_message: item.last_error,
    }
  })
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
