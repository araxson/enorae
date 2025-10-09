import { Suspense } from 'react'
import { EnhancedAnalytics } from '@/features/business/analytics'
import { PageLoading } from '@/components/shared'
export const metadata = { title: 'Analytics Dashboard', description: 'Business analytics and performance metrics', noIndex: true }
export default async function AnalyticsPage() {
  return <Suspense fallback={<PageLoading />}><EnhancedAnalytics /></Suspense>
}
