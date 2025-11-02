import { getMySessions, getCurrentSessionId } from './api/queries'
import { SessionsFeatureContent } from './components/sessions-feature-content'

export async function StaffSessionsPage() {
  const [sessions, currentSessionId] = await Promise.all([
    getMySessions(),
    getCurrentSessionId(),
  ])

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <SessionsFeatureContent sessions={sessions} currentSessionId={currentSessionId} />
    </section>
  )
}
export * from './types'
