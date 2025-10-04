import { Suspense } from 'react'
import { EnhancedAnalytics, EnhancedAnalyticsSkeleton } from '@/features/business/analytics'

export const metadata = {
  title: 'Analytics Dashboard',
  description: 'Business analytics and performance metrics',
}

export default async function AnalyticsPage() {
  return (
    <Suspense fallback={<EnhancedAnalyticsSkeleton />}>
      <EnhancedAnalytics />
    </Suspense>
  )
}
