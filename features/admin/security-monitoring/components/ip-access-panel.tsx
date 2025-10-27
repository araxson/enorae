import { Network, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { IpAccessEvent } from '@/features/admin/security-monitoring/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface IpAccessPanelProps {
  events: IpAccessEvent[]
}

export function IpAccessPanel({ events }: IpAccessPanelProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted" className="items-center gap-2">
            <ItemContent className="flex items-center gap-2">
              <Network className="h-4 w-4" aria-hidden="true" />
              <CardTitle>IP Access Control</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No access attempts recorded</EmptyTitle>
              <EmptyDescription>IP access logs populate once firewall events are captured.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="flex flex-col gap-2">
            {events.slice(0, 8).map((event) => (
              <Item key={event.id} variant="outline" className="flex-col items-start gap-2">
                <ItemContent className="w-full gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <ItemTitle>{event.ipAddress ?? 'Unknown IP'}</ItemTitle>
                    <ItemActions className="flex-none">
                      <Badge variant={event.isGranted ? 'outline' : 'destructive'}>
                        {event.isGranted ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                            {' '}
                            Allowed
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" aria-hidden="true" />
                            {' '}
                            Blocked
                          </>
                        )}
                      </Badge>
                    </ItemActions>
                  </div>
                  <ItemDescription>
                    {event.action} · {event.resourceType}
                  </ItemDescription>
                  <ItemDescription className="flex flex-wrap items-center gap-2">
                    <span>User: {event.userId ?? 'Anonymous'}</span>
                    <span>At {new Date(event.createdAt).toLocaleString()}</span>
                  </ItemDescription>
                  {event.userAgent ? (
                    <ItemDescription>Agent: {event.userAgent}</ItemDescription>
                  ) : null}
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
