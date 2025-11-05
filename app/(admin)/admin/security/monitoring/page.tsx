import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui'
import { SecurityAccessMonitoring } from '@/features/admin/security-access-monitoring'
export const metadata = { title: 'Security Access Monitoring | Admin' }
export default function SecurityAccessMonitoringPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SecurityAccessMonitoring />
    </Suspense>
  )
}
