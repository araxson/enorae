import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'
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
