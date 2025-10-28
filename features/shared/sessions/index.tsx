import { getUserSessions } from './api/queries'
import { SessionList } from './components'

export async function SessionManagement() {
  const sessions = await getUserSessions()

  return <SessionList sessions={sessions} />
}

export { getUserSessions, getSessionCount } from './api/queries'
export { revokeSession, revokeAllOtherSessions } from './api/mutations'
export type { SessionWithDevice } from './api/queries'
