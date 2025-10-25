import { Suspense } from 'react'
import { EnhancedAnalytics } from '@/features/business/analytics'
import { PageLoading } from '@/components/shared'
import { generateMetadata as genMeta } from '@/lib/metadata'
export const metadata = genMeta({ title: 'Analytics Dashboard', description: 'Monitor business analytics and performance metrics', noIndex: true })
export default async function AnalyticsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <EnhancedAnalytics />
    </Suspense>
  )
}
