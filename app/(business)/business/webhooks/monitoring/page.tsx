import { WebhookMonitoring, webhookMonitoringMetadata } from '@/features/business/webhooks-monitoring'

export const metadata = webhookMonitoringMetadata

export default function Page() {
  return <WebhookMonitoring />
}
