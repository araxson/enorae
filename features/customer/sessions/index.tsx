import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { getUserSessions } from './api/queries'
import { SessionList } from './components/session-list'

export async function SessionManagement() {
  const sessions = await getUserSessions()

  return <SessionList sessions={sessions} />
}

export function SessionManagementFeature() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SessionManagement />
    </Suspense>
  )
}

export { getUserSessions, getSessionCount } from './api/queries'
export { revokeSession, revokeAllOtherSessions } from './api/mutations'
export type { SessionWithDevice } from './api/queries'
