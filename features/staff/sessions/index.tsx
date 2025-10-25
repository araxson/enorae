import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { SessionList } from './components/session-list'
import { getMySessions, getCurrentSessionId } from './api/queries'
import type { Session } from './types'

interface SessionsFeatureProps {
  sessions: Session[]
  currentSessionId: string | null
}

export function SessionsFeature({ sessions, currentSessionId }: SessionsFeatureProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>Active Sessions</CardTitle>
            {sessions.filter(s => s['is_active']).length > 1 && (
              <Button variant="destructive" size="sm">
                Revoke All Other Sessions
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <SessionList sessions={sessions} currentSessionId={currentSessionId} />
    </div>
  )
}

export async function StaffSessionsPage() {
  const [sessions, currentSessionId] = await Promise.all([
    getMySessions(),
    getCurrentSessionId(),
  ])

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <SessionsFeature sessions={sessions} currentSessionId={currentSessionId} />
    </section>
  )
}
