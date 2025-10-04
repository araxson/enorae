import { Suspense } from 'react'
import { AdminDashboard } from '@/features/admin/dashboard'
import { DashboardSkeleton } from '@/features/admin/dashboard/components/dashboard-skeleton'

export const metadata = {
  title: 'Platform Dashboard | Admin',
  description: 'Platform administration and monitoring',
}

export default function AdminPortalPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboard />
    </Suspense>
  )
}
