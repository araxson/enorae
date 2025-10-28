import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { SessionList } from '.'
import type { Session } from '../types'

interface SessionsFeatureContentProps {
  sessions: Session[]
  currentSessionId: string | null
}

export function SessionsFeatureContent({ sessions, currentSessionId }: SessionsFeatureContentProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Active Sessions</CardTitle>
            {sessions.filter((s) => s['is_active']).length > 1 ? (
              <Button variant="destructive" size="sm">
                Revoke All Other Sessions
              </Button>
            ) : null}
          </div>
        </CardHeader>
      </Card>

      <SessionList sessions={sessions} currentSessionId={currentSessionId} />
    </div>
  )
}
