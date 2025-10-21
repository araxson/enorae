import { Network, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { IpAccessEvent } from '../api/types'

interface IpAccessPanelProps {
  events: IpAccessEvent[]
}

export function IpAccessPanel({ events }: IpAccessPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-muted-foreground" />
          <CardTitle>IP Access Control</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No access attempts recorded.</p>
        ) : (
          <div className="space-y-2">
            {events.slice(0, 8).map((event) => (
              <Card key={event.id}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-mono text-sm text-foreground">{event.ipAddress ?? 'Unknown IP'}</div>
                      <div className="text-xs text-muted-foreground">
                        {event.action} · {event.resourceType}
                      </div>
                    </div>
                    <Badge variant={event.isGranted ? 'outline' : 'destructive'} className="gap-1 text-xs">
                      {event.isGranted ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {event.isGranted ? 'Allowed' : 'Blocked'}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>User: {event.userId ?? 'Anonymous'}</span>
                    <span>At {new Date(event.createdAt).toLocaleString()}</span>
                  </div>
                  {event.userAgent && (
                    <div className="mt-1 truncate text-xs text-muted-foreground">
                      Agent: {event.userAgent}
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
