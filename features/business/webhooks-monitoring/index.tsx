import { generateMetadata as genMeta } from '@/lib/metadata'
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
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <MonitoringPanel stats={stats} failedWebhooks={failedWebhooks} />
      </section>
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load webhook monitoring data'

    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </section>
    )
  }
}
