'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SessionCard } from './session-card'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { revokeSession, revokeAllOtherSessions } from '../api/mutations'
import type { SessionWithDevice } from '../api/queries'

interface SessionListProps {
  sessions: SessionWithDevice[]
}

export function SessionList({ sessions }: SessionListProps) {
  const router = useRouter()
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
      setTimeout(() => {
        router.refresh()
      }, 500)
    } else {
      toast.error(result.error)
      setError(result.error)
    }

    setRevokingAll(false)
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="scroll-m-20 text-3xl font-semibold">Active Sessions</h2>
        <Alert>
          <AlertDescription>
            <p className="leading-7">No active sessions found.</p>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="scroll-m-20 text-3xl font-semibold">Active Sessions</h2>
          <p className="text-sm text-muted-foreground">
            You have {sessions.length} active session{sessions.length !== 1 ? 's' : ''} across your devices
          </p>
        </div>

        {otherSessions.length > 0 && (
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
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onRevoke={handleRevokeSession}
            isRevoking={revokingId === session.id}
          />
        ))}
      </div>

      <Alert>
        <AlertDescription>
          <div className="flex flex-col gap-3">
            <p className="leading-7 font-medium">Security Tip</p>
            <p className="text-sm text-muted-foreground">
              If you see a session you don&apos;t recognize, revoke it immediately and change your password.
              Your current session is marked with a badge and cannot be revoked from this page.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
