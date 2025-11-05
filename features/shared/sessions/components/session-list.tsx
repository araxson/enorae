'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SessionCard } from './session-card'
import { ConfirmDialog } from '@/features/shared/ui'
import { revokeSession, revokeAllOtherSessions } from '@/features/shared/sessions/api/mutations'
import type { SessionWithDevice } from '@/features/shared/sessions/api/queries'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { ShieldAlert } from 'lucide-react'

interface SessionListProps {
  sessions: SessionWithDevice[]
}

export function SessionList({ sessions }: SessionListProps) {
  const router = useRouter()
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
      }
    }
  }, [])

  const otherSessions = sessions.filter(s => !s.is_current)

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingId(sessionId)
    setError(null)
    setSuccess(null)

    const result = await revokeSession(sessionId)

    if (result.success) {
      toast.success('Session revoked successfully')
      router.refresh()
    } else {
      toast.error(result.error)
      setError(result.error)
    }

    setRevokingId(null)
  }

  const handleRevokeAll = async () => {
    if (otherSessions.length === 0) return

    setRevokingAll(true)
    setError(null)
    setSuccess(null)

    const result = await revokeAllOtherSessions()

    if (result.success) {
      toast.success(`Successfully revoked ${result.data.count} session(s)`)
      // Clear any existing timer
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
      }
      refreshTimerRef.current = setTimeout(() => {
        router.refresh()
        refreshTimerRef.current = null
      }, 500)
    } else {
      toast.error(result.error)
      setError(result.error)
    }

    setRevokingAll(false)
  }

  if (sessions.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShieldAlert className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No active sessions</EmptyTitle>
          <EmptyDescription>No active sessions found.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Sign in on another device to see it appear here.</EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Item>
        <ItemContent>
          <ItemTitle>Active Sessions</ItemTitle>
          <ItemDescription>
            You have {sessions.length} active session{sessions.length !== 1 ? 's' : ''} across your devices
          </ItemDescription>
        </ItemContent>
        {otherSessions.length > 0 && (
          <ItemActions>
            <ConfirmDialog
              title="Revoke All Other Sessions?"
              description={`Are you sure you want to revoke all ${otherSessions.length} other session(s)? This will sign you out from all other devices.`}
              confirmText="Revoke All"
              onConfirm={handleRevokeAll}
            >
              <Button
                variant="outline"
                disabled={revokingAll}
              >
                {revokingAll ? 'Revoking All...' : `Revoke All Other Sessions (${otherSessions.length})`}
              </Button>
            </ConfirmDialog>
          </ItemActions>
        )}
      </Item>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Revocation failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertTitle>Sessions updated</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <SessionCard
            key={session['id']}
            session={session}
            onRevoke={handleRevokeSession}
            isRevoking={revokingId === session['id']}
          />
        ))}
      </div>

      <Alert>
        <AlertTitle>Security tip</AlertTitle>
        <AlertDescription>
          If you see a session you don&apos;t recognize, revoke it immediately and change your password.
          Your current session is marked with a badge and cannot be revoked from this page.
        </AlertDescription>
      </Alert>
    </div>
  )
}
