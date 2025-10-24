import { Suspense } from 'react'
import { DatabaseHealthDashboard } from '@/features/admin/database-health'

export const metadata = { title: 'Database Health | Admin' }

export default function DatabaseHealthPage() {
  return (
    <Suspense fallback={null}>
      <DatabaseHealthDashboard />
    </Suspense>
  )
}
