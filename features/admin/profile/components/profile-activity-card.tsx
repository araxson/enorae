import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProfileDetail } from '@/features/admin/profile/api/types'

interface ProfileActivityCardProps {
  profile: ProfileDetail | null
  isLoading: boolean
}

const formatDate = (value: string | null) => {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return value
  }
}

const severityVariant = (severity: string | null) => {
  if (!severity) return 'outline'
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'destructive'
    case 'error':
      return 'destructive'
    case 'warning':
      return 'secondary'
    default:
      return 'outline'
  }
}

export function ProfileActivityCard({ profile, isLoading }: ProfileActivityCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Activity will appear here once a user is selected.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (profile.activity.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No audit events recorded for this profile in the recent window.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-3">
          {profile.activity.map((event) => (
            <Card key={`${event.id}-${event.createdAt ?? ''}`}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle>{event.eventType?.replace(/_/g, ' ') ?? 'Unknown event'}</CardTitle>
                  <Badge variant={severityVariant(event.severity)}>
                    {(event.severity ?? 'info').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                  </Badge>
                </div>
                <CardDescription>
                  {event.entityType ? `${event.entityType} · ` : ''}
                  {event.entityId ?? 'No entity id'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-0 text-xs text-muted-foreground">
                <span>{formatDate(event.createdAt)}</span>
                {event.ipAddress ? <span>IP {event.ipAddress}</span> : null}
                {event.userAgent ? <span className="truncate md:max-w-md">{event.userAgent}</span> : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
