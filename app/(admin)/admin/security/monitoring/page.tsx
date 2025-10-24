import { Suspense } from 'react'
import { SecurityAccessMonitoring } from '@/features/admin/security-access-monitoring'

export const metadata = { title: 'Security Access Monitoring | Admin' }

export default function SecurityAccessMonitoringPage() {
  return (
    <Suspense fallback={null}>
      <SecurityAccessMonitoring />
    </Suspense>
  )
}
