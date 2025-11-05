import type { ComponentProps } from 'react'
import { Shield, AlertCircle, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import type { SecurityEvent } from '@/features/admin/security-monitoring/api/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from '@/components/ui/drawer'

interface SecurityEventsPanelProps {
  events: SecurityEvent[]
}

const severityVariant: Record<string, ComponentProps<typeof Badge>['variant']> = {
  critical: 'destructive',
  high: 'destructive',
  warning: 'default',
  info: 'secondary',
  low: 'secondary',
}

const severityBadge = (severity: string) => {
  const normalized = severity.toLowerCase()
  const label = normalized.replace(/\b\w/g, (char) => char.toUpperCase())
  const variant = severityVariant[normalized] ?? 'outline'
  return (
    <Badge variant={variant}>
      {['critical', 'high'].includes(normalized) ? (
        <>
          <AlertCircle className="size-3" aria-hidden="true" />
          {' '}
        </>
      ) : null}
      {label}
    </Badge>
  )
}

export function SecurityEventsPanel({ events }: SecurityEventsPanelProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-muted-foreground" aria-hidden="true" />
          <CardTitle>Security Event Stream</CardTitle>
        </div>
        <CardDescription>Recent security signals across the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No security events recorded</EmptyTitle>
              <EmptyDescription>The feed updates automatically when new events arrive.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm">
                Refresh feed
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Detected</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>{event.eventType}</div>
                      {event.description ? (
                        <CardDescription>{event.description}</CardDescription>
                      ) : null}
                    </TableCell>
                    <TableCell>{severityBadge(event.severity)}</TableCell>
                    <TableCell>{event.userId ?? 'System'}</TableCell>
                    <TableCell>
                      <code>{event.ipAddress ?? 'Unknown'}</code>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`View details for ${event.eventType}`}>
                            <Eye className="size-4" aria-hidden="true" />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>{event.eventType}</DrawerTitle>
                            <DrawerDescription>
                              Detected {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="space-y-4 p-4 text-sm">
                            <div className="space-y-1">
                              <h4 className="font-medium leading-none">Summary</h4>
                              <p className="text-muted-foreground">
                                {event.description ?? 'No additional description provided.'}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-medium leading-none">Metadata</h4>
                              <dl className="grid grid-cols-1 gap-2">
                                <div>
                                  <dt className="text-muted-foreground">Severity</dt>
                                  <dd>{event.severity}</dd>
                                </div>
                                <div>
                                  <dt className="text-muted-foreground">User</dt>
                                  <dd>{event.userId ?? 'System'}</dd>
                                </div>
                                <div>
                                  <dt className="text-muted-foreground">IP address</dt>
                                  <dd>{event.ipAddress ?? 'Unknown'}</dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Close</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
