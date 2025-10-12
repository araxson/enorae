import { Section } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MonitoringPanel } from './components/monitoring-panel'
import { getWebhookMonitoringData } from './api/queries'

export async function WebhookMonitoring() {
  try {
    const { stats, failedWebhooks } = await getWebhookMonitoringData()

    return <MonitoringPanel stats={stats} failedWebhooks={failedWebhooks} />
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
