import 'server-only'

import type { Database } from '@/lib/types/database.types'
import {
  getFailedWebhooks,
  getWebhookStats,
  type WebhookStats,
} from '@/features/business/webhooks/api/queries/monitoring'

type FailedWebhookRow = Database['public']['Views']['communication_webhook_queue']['Row']

export interface WebhookMonitoringData {
  stats: WebhookStats
  failedWebhooks: FailedWebhookRow[]
}

export async function getWebhookMonitoringData(
  limit = 50,
): Promise<WebhookMonitoringData> {
  const [stats, failedWebhooks] = await Promise.all([
    getWebhookStats(),
    getFailedWebhooks(limit),
  ])

  return {
    stats,
    failedWebhooks,
  }
}
