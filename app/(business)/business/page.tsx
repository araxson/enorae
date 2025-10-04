import { Suspense } from 'react'
import { BusinessDashboard, DashboardSkeleton } from '@/features/business/dashboard'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Business Dashboard',
  description: 'Manage your salon business, view analytics and insights',
  noIndex: true,
})

/**
 * Business Portal Landing Page
 * Direct render - no redirect for better performance
 */
export default async function BusinessPortalPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <BusinessDashboard />
    </Suspense>
  )
}
