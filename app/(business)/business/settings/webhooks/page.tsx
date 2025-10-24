import { WebhookQueue } from '@/features/business/webhooks'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Webhook Queue',
  description: 'Monitor webhook delivery status and retry events',
  noIndex: true,
})

export default async function WebhookQueuePage() {
  return <WebhookQueue />
}
