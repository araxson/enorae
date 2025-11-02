import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'
import {
  getFailedWebhooks,
  getWebhookStats,
  type WebhookStats,
} from '@/features/business/webhooks/api/queries'

type FailedWebhookRow = Database['public']['Views']['communication_webhook_queue_view']['Row']

export interface WebhookMonitoringData {
  stats: WebhookStats
  failedWebhooks: FailedWebhookRow[]
}

/**
 * Get webhook monitoring data for the current salon
 * Note: Helper functions (getWebhookStats, getFailedWebhooks) already perform auth checks
 * This composition function adds explicit auth verification for defensive programming
 */
export async function getWebhookMonitoringData(
  limit = 50,
): Promise<WebhookMonitoringData> {
  const logger = createOperationLogger('getWebhookMonitoringData', {})
  logger.start()

  // Explicit auth check at composition level
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  // Delegate to helper functions (which also verify auth)
  const [stats, failedWebhooks] = await Promise.all([
    getWebhookStats(),
    getFailedWebhooks(limit),
  ])

  return {
    stats,
    failedWebhooks,
  }
}
