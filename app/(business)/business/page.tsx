import { Suspense } from 'react'
import { BusinessDashboard } from '@/features/business/dashboard'
import { PageLoading } from '@/features/shared/ui'
import { generateMetadata as genMeta } from '@/lib/metadata'
export const metadata = genMeta({ title: 'Business Dashboard', description: 'Manage your salon business, view analytics and insights', noIndex: true })
export default async function BusinessPortalPage() {
  return <Suspense fallback={<PageLoading />}><BusinessDashboard /></Suspense>
}

