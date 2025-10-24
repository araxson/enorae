import { Suspense } from 'react'
import { PolicyEnforcementOverview } from '@/features/admin/rate-limit-rules'

export const metadata = { title: 'Security Policy Enforcement | Admin' }

export default function SecurityPage() {
  return (
    <Suspense fallback={null}>
      <PolicyEnforcementOverview />
    </Suspense>
  )
}
