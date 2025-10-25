import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { DatabaseHealthDashboard } from '@/features/admin/database-health'
export const metadata = { title: 'Database Health | Admin' }
export default function DatabaseHealthPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <DatabaseHealthDashboard />
    </Suspense>
  )
}
