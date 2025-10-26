import { Network, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { IpAccessEvent } from '@/features/admin/security-monitoring/types'

interface IpAccessPanelProps {
  events: IpAccessEvent[]
}

export function IpAccessPanel({ events }: IpAccessPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4" aria-hidden="true" />
          <CardTitle>IP Access Control</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <CardDescription>No access attempts recorded.</CardDescription>
        ) : (
          <div className="flex flex-col gap-2">
            {events.slice(0, 8).map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{event.ipAddress ?? 'Unknown IP'}</CardTitle>
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
                  </div>
                  <CardDescription>
                    {event.action} · {event.resourceType}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardDescription>User: {event.userId ?? 'Anonymous'}</CardDescription>
                      <CardDescription>At {new Date(event.createdAt).toLocaleString()}</CardDescription>
                    </div>
                    {event.userAgent ? (
                      <CardDescription>Agent: {event.userAgent}</CardDescription>
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
