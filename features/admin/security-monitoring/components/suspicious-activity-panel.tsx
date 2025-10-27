import { AlertTriangle, Clock3, ShieldOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import type { SuspiciousSession } from '@/features/admin/security-monitoring/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface SuspiciousActivityPanelProps {
  sessions: SuspiciousSession[]
  blockedSessions: number
}

const riskBadge = (score: number | null) => {
  if (score === null || score === undefined) return <Badge variant="outline">Unknown</Badge>
  if (score >= 80) return <Badge variant="destructive">Critical</Badge>
  if (score >= 60) return <Badge variant="secondary">High</Badge>
  if (score >= 40) return <Badge variant="outline">Elevated</Badge>
  return <Badge variant="outline">Low</Badge>
}

export function SuspiciousActivityPanel({ sessions, blockedSessions }: SuspiciousActivityPanelProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="items-center justify-between gap-3">
            <ItemContent className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <CardTitle>Suspicious Sessions</CardTitle>
            </ItemContent>
            <ItemActions className="flex-none">
              <Badge variant={blockedSessions ? 'destructive' : 'outline'}>
                {blockedSessions} blocked
              </Badge>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No suspicious activity detected</EmptyTitle>
              <EmptyDescription>Session monitoring will surface anomalies as soon as they occur.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <ItemGroup>
                    <Item className="flex-wrap items-center justify-between gap-2">
                      <ItemContent className="flex items-center gap-2">
                        {riskBadge(session.suspiciousScore ?? 0)}
                        <CardTitle>Suspicious score {session.suspiciousScore ?? 'n/a'}</CardTitle>
                      </ItemContent>
                      {session.isBlocked ? (
                        <ItemActions className="flex-none items-center gap-1">
                          <Badge variant="destructive">
                            <ShieldOff className="h-3 w-3" aria-hidden="true" />
                            {' '}
                            Blocked
                          </Badge>
                        </ItemActions>
                      ) : null}
                    </Item>
                  </ItemGroup>
                  <CardDescription>
                    IP {session.ipAddress ?? 'Unknown'} · User {session.userId ?? 'Anonymous'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {session.userAgent ? (
                      <CardDescription>Agent: {session.userAgent}</CardDescription>
                    ) : null}
                    {session.lastActivityAt ? (
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-3 w-3" aria-hidden="true" />
                        <CardDescription>
                          Last activity {formatDistanceToNow(new Date(session.lastActivityAt), { addSuffix: true })}
                        </CardDescription>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
