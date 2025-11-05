'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Monitor, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { revokeSession } from '@/features/staff/sessions/api/mutations'
import type { StaffSessionDetail } from '@/features/staff/sessions/api/types'
import { SessionRow } from './session-row'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

interface SessionListProps {
  sessions: StaffSessionDetail[]
  currentSessionId: string | null
}

export function SessionList({ sessions, currentSessionId }: SessionListProps) {
  const router = useRouter()
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null)
  const [isRevoking, setIsRevoking] = useState(false)

  const handleRevoke = async () => {
    if (!pendingSessionId) {
      return
    }

    setIsRevoking(true)
    try {
      await revokeSession(pendingSessionId)
      toast.success('Session revoked')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to revoke session')
    } finally {
      setIsRevoking(false)
      setPendingSessionId(null)
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
                <Monitor className="size-12 text-muted-foreground" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No active sessions</EmptyTitle>
              <EmptyDescription>Sign in on a device to see sessions here.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="outline">
                <a href="/staff/settings">Review security settings</a>
              </Button>
            </EmptyContent>
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
              {activeSessions.map((session) => (
                <SessionRow
                  key={session['id']}
                  session={session}
                  isCurrent={session['id'] === currentSessionId}
                  isRevoking={isRevoking}
                  pendingSessionId={pendingSessionId}
                  onRevoke={setPendingSessionId}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {activeSessions.length > 1 && (
        <Alert>
          <AlertTriangle className="size-4" />
          <AlertTitle>Multiple sessions active</AlertTitle>
          <AlertDescription>
            You have {activeSessions.length} active sessions. If you don&apos;t recognize a session, revoke it immediately.
          </AlertDescription>
        </Alert>
      )}

      <AlertDialog
        open={pendingSessionId !== null}
        onOpenChange={(open) => {
          if (!open && !isRevoking) {
            setPendingSessionId(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this session?</AlertDialogTitle>
            <AlertDialogDescription>
              The selected device will be signed out immediately. Continue if this session looks unfamiliar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Keep session</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevoke} disabled={isRevoking}>
              {isRevoking ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="size-4" />
                  Revoking…
                </span>
              ) : (
                'Revoke session'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
