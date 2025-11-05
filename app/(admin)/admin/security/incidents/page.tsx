import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui'
import { IncidentResponseTimeline } from '@/features/admin/security-incidents'
export const metadata = { title: 'Incident Response | Admin' }
export default function IncidentsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <IncidentResponseTimeline />
    </Suspense>
  )
}
