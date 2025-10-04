import { WebhookQueue } from '@/features/business/webhooks'

export const metadata = {
  title: 'Webhook Queue',
  description: 'Monitor webhook delivery status',
}

export default async function WebhookQueuePage() {
  return <WebhookQueue />
}
