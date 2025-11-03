import { Suspense } from 'react'

import { getUserSessions } from './api/queries'
import { SessionList } from './components'

import { Spinner } from '@/components/ui/spinner'

export async function SessionManagement() {

  const sessions = await getUserSessions()

  return <SessionList sessions={sessions} />
}

export function SessionManagementFeature() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      }
    >
      <SessionManagement />
    </Suspense>
  )
}

export { getUserSessions, getSessionCount } from './api/queries'
export { revokeSession, revokeAllOtherSessions } from './api/mutations'
export type { SessionWithDevice } from './api/queries'
export * from './api/types'
