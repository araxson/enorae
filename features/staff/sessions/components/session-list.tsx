'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Monitor, Smartphone, Tablet, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { revokeSession } from '../api/mutations'
import type { StaffSessionDetail } from '../types'

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
      <Card className="p-8 text-center">
        <p className="leading-7 text-muted-foreground">No active sessions found</p>
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
          <Card key={session.id} className="p-4">
            <div className="flex gap-4 items-start justify-between">
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex gap-3 items-center">
                  {getDeviceIcon(session.device_type)}
                  <h3 className="scroll-m-20 text-2xl font-semibold">{session.device_name || 'Unknown Device'}</h3>
                  {isCurrent && (
                    <Badge variant="default">Current</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {session.browser_name} {session.browser_version && `v${session.browser_version}`}
                </p>

                {session.ip_address && (
                  <p className="text-sm text-muted-foreground text-xs">
                    IP: {session.ip_address}
                  </p>
                )}

                {session.location && (
                  <p className="text-sm text-muted-foreground text-xs">
                    Location: {session.location}
                  </p>
                )}

                {formattedLastActive && (
                  <p className="text-sm text-muted-foreground text-xs">
                    Last active: {formattedLastActive}
                  </p>
                )}

                {formattedCreatedAt && (
                  <p className="text-sm text-muted-foreground text-xs">
                    Created: {formattedCreatedAt}
                  </p>
                )}
              </div>

              {!isCurrent && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => session.id && handleRevoke(session.id)}
                  disabled={revokingId === session.id}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
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
