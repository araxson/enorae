import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { SessionCardProps } from '@/features/shared/sessions/types'

export function SessionCard({ session, onRevoke, isRevoking }: SessionCardProps) {
  const formatDate = (date: string | null) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActivityStatus = (lastActivity: string | null) => {
    if (!lastActivity) return 'Inactive'

    const now = new Date()
    const activityDate = new Date(lastActivity)
    const diffMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60))

    if (diffMinutes < 5) return 'Active now'
    if (diffMinutes < 60) return `Active ${diffMinutes} minutes ago`
    if (diffMinutes < 1440) return `Active ${Math.floor(diffMinutes / 60)} hours ago`
    return `Active ${Math.floor(diffMinutes / 1440)} days ago`
  }

  const sessionLabel = session['id']?.substring(0, 8) || 'Unknown'

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Session {sessionLabel}</CardTitle>
              {session.is_current && <Badge variant="default">Current session</Badge>}
              {session['is_suspicious'] && <Badge variant="destructive">Suspicious</Badge>}
            </div>
            <CardDescription>{getActivityStatus(session['updated_at'])}</CardDescription>
          </div>

          {!session.is_current && session['id'] && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRevoke(session['id']!)}
              disabled={isRevoking}
            >
              {isRevoking ? 'Revoking...' : 'Revoke'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2">
          <div className="flex flex-wrap gap-3">
            <dt className="text-muted-foreground">Created</dt>
            <dd>{formatDate(session['created_at'])}</dd>
          </div>
          <div className="flex flex-wrap gap-3">
            <dt className="text-muted-foreground">Last updated</dt>
            <dd>{formatDate(session['updated_at'])}</dd>
          </div>
          <div className="flex flex-wrap gap-3">
            <dt className="text-muted-foreground">Status</dt>
            <dd>{session['is_active'] ? 'Active' : 'Inactive'}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
