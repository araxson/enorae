import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui'
import { SessionSecurityMonitoring } from '@/features/admin/session-security'
export const metadata = { title: 'Session Security | Admin' }
export default function SessionSecurityPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SessionSecurityMonitoring />
    </Suspense>
  )
}
