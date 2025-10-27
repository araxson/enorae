'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Monitor, Smartphone, Tablet, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { revokeSession } from '@/features/staff/sessions/api/mutations'
import type { StaffSessionDetail } from '@/features/staff/sessions/types'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface SessionListProps {
  sessions: StaffSessionDetail[]
  currentSessionId: string | null
}

export function SessionList({ sessions, currentSessionId }: SessionListProps) {
  const [revokingId, setRevokingId] = useState<string | null>(null)

  const getDeviceIcon = (deviceType: string | null | undefined) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const handleRevoke = async (sessionId: string) => {
    if (!confirm('Are you sure you want to revoke this session? You will be logged out on that device.')) {
      return
    }

    try {
      setRevokingId(sessionId)
      await revokeSession(sessionId)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to revoke session')
    } finally {
      setRevokingId(null)
    }
  }

  const activeSessions = sessions.filter(s => s['is_active'])

  if (activeSessions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Monitor className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No active sessions</EmptyTitle>
              <EmptyDescription>Sign in on a device to see sessions here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage devices where you&apos;re currently signed in</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session) => {
                const isCurrent = session['id'] === currentSessionId
                const lastActiveValue = typeof session.last_active_at === "string" ? session.last_active_at : null
                const parsedLastActive = lastActiveValue ? new Date(lastActiveValue) : null
                const formattedLastActive = parsedLastActive ? format(parsedLastActive, 'PPp') : 'Never'

                return (
                  <TableRow key={session['id']}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(session.device_type)}
                        <div>
                          <div className="font-medium">{session.device_name || 'Unknown Device'}</div>
                          {session.ip_address ? (
                            <div className="text-xs text-muted-foreground">{session.ip_address}</div>
                          ) : null}
                        </div>
                        {isCurrent ? <Badge variant="default">Current</Badge> : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {session.browser_name} {session.browser_version ? `v${session.browser_version}` : ''}
                    </TableCell>
                    <TableCell>{session.location || 'Unknown'}</TableCell>
                    <TableCell>{formattedLastActive}</TableCell>
                    <TableCell className="text-right">
                      {!isCurrent ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => session['id'] && handleRevoke(session['id'])}
                          disabled={revokingId === session['id']}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {activeSessions.length > 1 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Multiple sessions active</AlertTitle>
          <AlertDescription>
            You have {activeSessions.length} active sessions. If you don&apos;t recognize a session, revoke it immediately.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
