import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'
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
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <CardTitle>Active Sessions</CardTitle>
              </ItemContent>
              {sessions.filter((s) => s['is_active']).length > 1 ? (
                <ItemActions>
                  <Button variant="destructive" size="sm">
                    Revoke All Other Sessions
                  </Button>
                </ItemActions>
              ) : null}
            </Item>
          </ItemGroup>
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
