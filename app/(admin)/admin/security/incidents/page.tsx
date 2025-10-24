import { Suspense } from 'react'
import { IncidentResponseTimeline } from '@/features/admin/security-incidents'

export const metadata = { title: 'Incident Response | Admin' }

export default function IncidentsPage() {
  return (
    <Suspense fallback={null}>
      <IncidentResponseTimeline />
    </Suspense>
  )
}
