import { Suspense } from 'react'
import { RateLimitConsole } from '@/features/admin/rate-limit-tracking'

export const metadata = { title: 'Rate Limit Monitoring | Admin' }

export default function RateLimitMonitoringPage() {
  return (
    <Suspense fallback={null}>
      <RateLimitConsole />
    </Suspense>
  )
}
