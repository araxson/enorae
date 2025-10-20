import { generateMetadata as genMeta } from '@/lib/metadata'
import { Section } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MonitoringPanel } from './components/monitoring-panel'
import { getWebhookMonitoringData } from './api/queries'

export const webhookMonitoringMetadata = genMeta({
  title: 'Webhook Monitoring',
  description: 'Monitor webhook deliveries and track performance metrics',
})

export async function WebhookMonitoring() {
  try {
    const { stats, failedWebhooks } = await getWebhookMonitoringData()

    return (
      <Section size="lg">
        <MonitoringPanel stats={stats} failedWebhooks={failedWebhooks} />
      </Section>
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load webhook monitoring data'

    return (
      <Section size="lg">
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </Section>
    )
  }
}
