'use client'

import type { WebhookStats, WebhookDeliveryLog } from '@/features/business/webhooks/api/queries'
import { WebhookStatsCards } from './webhook-stats-cards'
import { FailedWebhooksSection } from './failed-webhooks-section'
import { DeliveryLogsSection } from './delivery-logs-section'

interface WebhookMonitoringDashboardProps {
  stats: WebhookStats
  failedWebhooks: FailedWebhook[]
  deliveryLogs?: WebhookDeliveryLog[]
}

interface FailedWebhook {
  id: string
  url: string
  event_type: string
  error_message: string | null
  created_at: string
}

export function WebhookMonitoringDashboard({
  stats,
  failedWebhooks,
  deliveryLogs = [],
}: WebhookMonitoringDashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      <WebhookStatsCards stats={stats} />
      <FailedWebhooksSection failedWebhooks={failedWebhooks} />
      <DeliveryLogsSection deliveryLogs={deliveryLogs} />
    </div>
  )
}
