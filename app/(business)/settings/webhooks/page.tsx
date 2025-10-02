import { WebhookQueue } from '@/features/webhook-queue'
import { getWebhookQueue } from '@/features/webhook-queue/dal/webhook-queue.queries'

export const metadata = {
  title: 'Webhook Queue',
  description: 'Monitor webhook delivery status',
}

export default async function WebhookQueuePage() {
  const webhooks = await getWebhookQueue()
  return <WebhookQueue initialWebhooks={webhooks} />
}
