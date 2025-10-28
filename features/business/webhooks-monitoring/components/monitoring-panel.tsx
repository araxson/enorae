import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import type { WebhookStats } from '@/features/business/webhooks/api/queries'
import { WebhookMonitoringDashboard } from '@/features/business/webhooks/components/webhook-monitoring-dashboard'
import type { Database } from '@/lib/types/database.types'

type FailedWebhookRow =
  Database['public']['Views']['communication_webhook_queue_view']['Row']

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
      <ItemGroup className="gap-2">
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>Webhook Monitoring</ItemTitle>
            <ItemDescription>
              Monitor webhook deliveries and track performance metrics
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>

      <WebhookMonitoringDashboard
        stats={stats}
        failedWebhooks={normalizedFailedWebhooks}
      />
    </div>
  )
}
