import { Suspense } from 'react'
import { StaffDashboard } from '@/features/staff/dashboard'
import { PageLoading } from '@/features/shared/ui'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Staff Portal | Enorae', description: 'Staff dashboard and management' }

export default function StaffPortalPage() {
  return <Suspense fallback={<PageLoading />}><StaffDashboard /></Suspense>
}
