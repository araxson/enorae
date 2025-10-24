import { Suspense } from 'react'
import { SessionSecurityMonitoring } from '@/features/admin/session-security'

export const metadata = { title: 'Session Security | Admin' }

export default function SessionSecurityPage() {
  return (
    <Suspense fallback={null}>
      <SessionSecurityMonitoring />
    </Suspense>
  )
}
