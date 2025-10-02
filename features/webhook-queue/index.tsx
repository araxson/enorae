import { WebhookList } from './components/webhook-list'
import type { Database } from '@/lib/types/database.types'

type WebhookQueue = Database['communication']['Tables']['webhook_queue']['Row']

type WebhookQueueProps = {
  initialWebhooks: WebhookQueue[]
}

export function WebhookQueue({ initialWebhooks }: WebhookQueueProps) {
  return (
    <div className="space-y-6">
      <div>
        <H2>Webhook Queue</H2>
        <Muted className="mt-1">
          Monitor webhook delivery status and history
        </Muted>
      </div>

      <WebhookList webhooks={initialWebhooks} />
    </div>
  )
}
