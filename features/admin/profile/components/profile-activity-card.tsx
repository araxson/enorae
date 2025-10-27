import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { ProfileDetail } from '@/features/admin/profile/types'

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
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No profile selected</EmptyTitle>
              <EmptyDescription>Choose a profile to inspect recent activity.</EmptyDescription>
            </EmptyHeader>
          </Empty>
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
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No audit events recorded</EmptyTitle>
              <EmptyDescription>Activity history updates as events stream in for this profile.</EmptyDescription>
            </EmptyHeader>
          </Empty>
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
              <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-0">
                <span className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</span>
                {event.ipAddress ? (
                  <span className="text-xs text-muted-foreground">IP {event.ipAddress}</span>
                ) : null}
                {event.userAgent ? (
                  <span className="truncate text-xs text-muted-foreground md:max-w-md">
                    {event.userAgent}
                  </span>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
