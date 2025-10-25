import type { WebhookStats } from '@/features/business/webhooks/api/queries/monitoring'
import { WebhookMonitoringDashboard } from '@/features/business/webhooks/components/webhook-monitoring-dashboard'
import type { Database } from '@/lib/types/database.types'

type FailedWebhookRow =
  Database['public']['Views']['communication_webhook_queue']['Row']

interface MonitoringPanelProps {
  stats: WebhookStats
  failedWebhooks: FailedWebhookRow[]
}

function normalizeFailedWebhooks(
  failedWebhooks: FailedWebhookRow[],
) {
  return failedWebhooks.map((webhook) => ({
    id: webhook['id'] ?? '',
    url: webhook['url'] ?? 'Unknown destination',
    event_type: 'webhook', // event_type field doesn't exist in view, use generic type
    error_message: webhook['last_error'] ?? null, // The field is 'last_error', not 'error_message'
    created_at: webhook['created_at'] ?? new Date().toISOString(),
  }))
}

export function MonitoringPanel({
  stats,
  failedWebhooks,
}: MonitoringPanelProps) {
  const normalizedFailedWebhooks = normalizeFailedWebhooks(failedWebhooks)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold">Webhook Monitoring</h1>
        <p className="leading-7 text-muted-foreground">
          Monitor webhook deliveries and track performance metrics
        </p>
      </div>

      <WebhookMonitoringDashboard
        stats={stats}
        failedWebhooks={normalizedFailedWebhooks}
      />
    </div>
  )
}
