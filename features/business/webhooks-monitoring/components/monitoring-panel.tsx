import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
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
    id: webhook.id,
    url: webhook.url ?? 'Unknown destination',
    event_type: webhook.event_type ?? 'unknown',
    error_message: webhook.error_message,
    created_at: webhook.created_at ?? new Date().toISOString(),
  }))
}

export function MonitoringPanel({
  stats,
  failedWebhooks,
}: MonitoringPanelProps) {
  const normalizedFailedWebhooks = normalizeFailedWebhooks(failedWebhooks)

  return (
    <Stack gap="xl">
      <div>
        <H1>Webhook Monitoring</H1>
        <P className="text-muted-foreground">
          Monitor webhook deliveries and track performance metrics
        </P>
      </div>

      <WebhookMonitoringDashboard
        stats={stats}
        failedWebhooks={normalizedFailedWebhooks}
      />
    </Stack>
  )
}
