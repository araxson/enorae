import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
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
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Recent activity</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
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
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Recent activity</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
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
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Recent activity</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
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
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Recent activity</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-3">
        <ItemGroup className="space-y-2">
          {profile.activity.map((event) => (
            <Item key={`${event.id}-${event.createdAt ?? ''}`} variant="outline">
              <ItemHeader>
                <ItemTitle>{event.eventType?.replace(/_/g, ' ') ?? 'Unknown event'}</ItemTitle>
                <ItemActions className="flex-none">
                  <Badge variant={severityVariant(event.severity)}>
                    {(event.severity ?? 'info')
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </Badge>
                </ItemActions>
              </ItemHeader>
              <ItemContent>
                <ItemDescription>
                  {event.entityType ? `${event.entityType} · ` : ''}
                  {event.entityId ?? 'No entity id'}
                </ItemDescription>
              </ItemContent>
              <ItemFooter className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(event.createdAt)}</span>
                {event.ipAddress ? <span>IP {event.ipAddress}</span> : null}
                {event.userAgent ? (
                  <span className="truncate md:max-w-md">{event.userAgent}</span>
                ) : null}
              </ItemFooter>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
