import { Suspense } from 'react'
import { CustomerDashboard, CustomerDashboardSkeleton } from '@/features/customer/dashboard'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Customer Portal | Enorae', description: 'Your appointments and favorites' }

export default function CustomerPortalPage() {
  return <Suspense fallback={<CustomerDashboardSkeleton />}><CustomerDashboard /></Suspense>
}
