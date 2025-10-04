import { Suspense } from 'react'
import { StaffDashboard } from '@/features/staff/dashboard'
import { DashboardSkeleton } from '@/components/shared'

export const metadata = {
  title: 'Staff Portal | Enorae',
  description: 'Staff dashboard and management',
}

/**
 * Staff Portal Landing Page
 * Shows the staff dashboard with appointments and metrics
 */
export default function StaffPortalPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <StaffDashboard />
    </Suspense>
  )
}
