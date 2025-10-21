'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SessionCard } from './session-card'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
        <div className="text-2xl font-semibold text-foreground">Active Sessions</div>
        <Alert className="border-secondary/40 bg-secondary/10 text-secondary-foreground">
          <Info className="h-4 w-4 text-secondary" />
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>
            <div>No active sessions found.</div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-semibold text-foreground">Active Sessions</div>
          <div className="text-muted-foreground">
            You have {sessions.length} active session{sessions.length !== 1 ? 's' : ''} across your devices
          </div>
        </div>

        {otherSessions.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={revokingAll}>
                {revokingAll ? 'Revoking All...' : `Revoke All Other Sessions (${otherSessions.length})`}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke All Other Sessions?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to revoke all {otherSessions.length} other session(s)? This will sign you out from all other devices.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={revokingAll}>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    onClick={(event) => {
                      event.preventDefault()
                      void handleRevokeAll()
                    }}
                    disabled={revokingAll}
                  >
                    {revokingAll ? 'Revoking All...' : 'Revoke All'}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-primary/40 bg-primary/10 text-primary-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3">
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
        <AlertTitle>Notice</AlertTitle>
        <AlertDescription>
          <div className="flex flex-col gap-2">
            <div className="font-medium text-foreground">Security Tip</div>
            <div className="text-muted-foreground">
              If you see a session you don&apos;t recognize, revoke it immediately and change your password.
              Your current session is marked with a badge and cannot be revoked from this page.
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
