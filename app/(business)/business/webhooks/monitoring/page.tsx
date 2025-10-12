import { WebhookMonitoring } from '@/features/business/webhooks-monitoring'

export const metadata = {
  title: 'Webhook Monitoring',
  description: 'Monitor webhook deliveries and track performance metrics',
}

export default async function WebhookMonitoringPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <WebhookMonitoring />
    </div>
  )
}
