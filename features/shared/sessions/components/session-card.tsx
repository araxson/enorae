import { Card, CardContent } from '@/components/ui/card'
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

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-start justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 items-center">
                <p className="leading-7 font-medium">Session {session.id?.substring(0, 8) || 'Unknown'}</p>
                {session.is_current && (
                  <Badge variant="default">Current Session</Badge>
                )}
                {session.is_suspicious && (
                  <Badge variant="destructive">Suspicious</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{getActivityStatus(session.updated_at)}</p>
            </div>

            {!session.is_current && session.id && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRevoke(session.id!)}
                disabled={isRevoking}
              >
                {isRevoking ? 'Revoking...' : 'Revoke'}
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <p className="text-sm font-medium w-24 text-muted-foreground">Created:</p>
              <p className="text-sm font-medium">{formatDate(session.created_at)}</p>
            </div>

            <div className="flex gap-3">
              <p className="text-sm font-medium w-24 text-muted-foreground">Last Updated:</p>
              <p className="text-sm font-medium">{formatDate(session.updated_at)}</p>
            </div>

            <div className="flex gap-3">
              <p className="text-sm font-medium w-24 text-muted-foreground">Status:</p>
              <p className="text-sm font-medium">{session.is_active ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
