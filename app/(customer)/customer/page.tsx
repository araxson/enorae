import { Suspense } from 'react'
import { CustomerDashboard } from '@/features/customer/dashboard'
import { PageLoading } from '@/features/shared/ui-components'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Customer Portal | Enorae', description: 'Your appointments and favorites' }

export default function CustomerPortalPage() {
  return <Suspense fallback={<PageLoading />}><CustomerDashboard /></Suspense>
}
