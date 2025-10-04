import { getWebhookQueue } from './api/queries'
import { WebhookList } from './components/webhook-list'

export async function WebhookQueue() {
  const webhooks = await getWebhookQueue()

  return <WebhookList webhooks={webhooks} />
}

export { getWebhookQueue, getWebhookQueueById } from './api/queries'
export { retryWebhook, deleteWebhook, retryAllFailedWebhooks, clearCompletedWebhooks } from './api/mutations'
