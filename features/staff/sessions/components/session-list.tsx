'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Monitor, Smartphone, Tablet, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { revokeSession } from '@/features/staff/sessions/api/mutations'
import type { StaffSessionDetail } from '@/features/staff/sessions/types'

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

  const activeSessions = sessions.filter(s => s.is_active)

  if (activeSessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <CardTitle>No active sessions</CardTitle>
            <CardDescription>Sign in on a device to see sessions here.</CardDescription>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {activeSessions.map((session) => {
        const isCurrent = session.id === currentSessionId
        const lastActiveValue = typeof session.last_active_at === "string" ? session.last_active_at : null
        const createdValue = typeof session.created_at === "string" ? session.created_at : null
        const parsedLastActive = lastActiveValue ? new Date(lastActiveValue) : null
        const parsedCreatedAt = createdValue ? new Date(createdValue) : null
        const formattedLastActive = parsedLastActive ? format(parsedLastActive, 'PPp') : null
        const formattedCreatedAt = parsedCreatedAt ? format(parsedCreatedAt, 'PPp') : null

        return (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(session.device_type)}
                  <CardTitle>{session.device_name || 'Unknown Device'}</CardTitle>
                  {isCurrent ? <Badge variant="default">Current</Badge> : null}
                </div>
                {!isCurrent ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => session.id && handleRevoke(session.id)}
                    disabled={revokingId === session.id}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <CardDescription>
                  {session.browser_name} {session.browser_version ? `v${session.browser_version}` : ''}
                </CardDescription>
                {session.ip_address ? <p>IP: {session.ip_address}</p> : null}
                {session.location ? <p>Location: {session.location}</p> : null}
                {formattedLastActive ? <p>Last active: {formattedLastActive}</p> : null}
                {formattedCreatedAt ? <p>Created: {formattedCreatedAt}</p> : null}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {activeSessions.length > 1 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {activeSessions.length} active sessions. If you don&apos;t recognize a session, revoke it immediately.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
