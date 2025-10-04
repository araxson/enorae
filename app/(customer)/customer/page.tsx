import { Suspense } from 'react'
import { CustomerDashboard } from '@/features/customer/dashboard'
import { DashboardSkeleton } from '@/components/shared'

export const metadata = {
  title: 'Customer Portal | Enorae',
  description: 'Your appointments and favorites',
}

/**
 * Customer Portal Landing Page
 * Shows the customer dashboard with appointments and favorites
 */
export default function CustomerPortalPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <CustomerDashboard />
    </Suspense>
  )
}
