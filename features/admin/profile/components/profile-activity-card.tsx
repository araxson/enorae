import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProfileDetail } from '../api/types'

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
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {profile.activity.map((event) => (
            <li key={`${event.id}-${event.createdAt ?? ''}`} className="rounded-lg border px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium capitalize">
                    {event.eventType?.replace(/_/g, ' ') ?? 'Unknown event'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.entityType ? `${event.entityType} · ` : ''}
                    {event.entityId ?? 'No entity id'}
                  </p>
                </div>
                <Badge variant={severityVariant(event.severity)} className="capitalize">
                  {event.severity ?? 'info'}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>{formatDate(event.createdAt)}</span>
                {event.ipAddress && <span>IP {event.ipAddress}</span>}
                {event.userAgent && <span className="truncate md:max-w-md">{event.userAgent}</span>}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
