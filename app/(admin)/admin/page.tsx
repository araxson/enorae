import { Suspense } from 'react'
import { AdminDashboard } from '@/features/admin/dashboard'
import { PageLoading } from '@/components/shared'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Platform Dashboard | Admin', description: 'Platform administration and monitoring' }

export default function AdminPortalPage() {
  return <Suspense fallback={<PageLoading />}><AdminDashboard /></Suspense>
}
