import { Suspense } from 'react'
import { WebhookMonitoring, webhookMonitoringMetadata } from '@/features/business/webhooks-monitoring'
import { PageLoading } from '@/features/shared/ui'

export const metadata = webhookMonitoringMetadata

export default async function Page() {
  return <Suspense fallback={<PageLoading />}><WebhookMonitoring /></Suspense>
}
