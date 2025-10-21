import { AlertTriangle, Clock3, ShieldOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import type { SuspiciousSession } from '../api/types'

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
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <CardTitle>Suspicious Sessions</CardTitle>
          </div>
          <Badge variant={blockedSessions ? 'destructive' : 'outline'} className="text-xs">
            {blockedSessions} blocked
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No suspicious activity detected in the selected timeframe.
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {riskBadge(session.suspiciousScore ?? 0)}
                      <span className="text-sm font-semibold text-foreground">
                        Suspicious score {session.suspiciousScore ?? 'n/a'}
                      </span>
                    </div>
                    {session.isBlocked && (
                      <Badge variant="destructive" className="gap-1 text-xs">
                        <ShieldOff className="h-3 w-3" />
                        Blocked
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
                    <span>IP: {session.ipAddress ?? 'Unknown'}</span>
                    <span>User: {session.userId ?? 'Anonymous'}</span>
                    {session.userAgent && (
                      <span className="truncate">Agent: {session.userAgent}</span>
                    )}
                  </div>
                  {session.lastActivityAt && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="h-3 w-3" />
                      Last activity {formatDistanceToNow(new Date(session.lastActivityAt), { addSuffix: true })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
