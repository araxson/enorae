import { Suspense } from 'react'
import { BusinessInsights, businessInsightsMetadata } from '@/features/business/insights'
import { PageLoading } from '@/features/shared/ui-components'

export const metadata = businessInsightsMetadata

export default async function Page() {
  return <Suspense fallback={<PageLoading />}><BusinessInsights /></Suspense>
}
