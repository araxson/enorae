import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

export interface WebhookStats {
  total_webhooks: number
  successful_deliveries: number
  failed_deliveries: number
  pending_deliveries: number
  success_rate: number
  avg_delivery_time: number
}

export interface WebhookDeliveryLog {
  id: string
  webhook_id: string
  status: string
  response_code: number | null
  response_body: string | null
  delivery_time_ms: number | null
  error_message: string | null
  created_at: string
}

export async function getWebhookStats(): Promise<WebhookStats> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('communication')
    .from('webhook_queue')
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

  const { data, error } = await supabase
    .schema('communication')
    .from('webhook_delivery_logs')
    .select('*')
    .eq('webhook_id', webhookId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as WebhookDeliveryLog[]
}

export async function getFailedWebhooks(limit = 50) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('communication')
    .from('webhook_queue')
    .select('*')
    .eq('salon_id', salonId)
    .eq('status', 'failed')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
