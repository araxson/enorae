import { getWebhookStats, getFailedWebhooks } from '../api/monitoring.queries'
import { WebhookMonitoringDashboard } from '../components/webhook-monitoring-dashboard'
import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function WebhookMonitoring() {
  const stats = await getWebhookStats()
  const failedWebhooks = await getFailedWebhooks()

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
        failedWebhooks={failedWebhooks}
      />
    </Stack>
  )
}
