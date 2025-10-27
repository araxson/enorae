'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
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
import { revokeSession, revokeAllOtherSessions } from '@/features/customer/sessions/api/mutations'
import type { SessionWithDevice } from '@/features/customer/sessions/api/queries'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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

  const formatDate = (date: string | null) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActivityStatus = (lastActivity: string | null) => {
    if (!lastActivity) return 'Inactive'

    const now = new Date()
    const activityDate = new Date(lastActivity)
    const diffMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60))

    if (diffMinutes < 5) return 'Active now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return `${Math.floor(diffMinutes / 1440)}d ago`
  }

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
      <Empty>
        <EmptyMedia variant="icon">
          <Info className="h-6 w-6" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No active sessions</EmptyTitle>
          <EmptyDescription>
            You&apos;re not signed in on any other devices right now.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          Keep this page open to monitor new sign-ins in real time.
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <ItemGroup className="gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Item className="flex-1" variant="muted">
          <ItemContent>
            <ItemTitle>Active Sessions</ItemTitle>
            <ItemDescription>
              You have {sessions.length} active session{sessions.length !== 1 ? 's' : ''} across your devices
            </ItemDescription>
          </ItemContent>
        </Item>

        {otherSessions.length > 0 ? (
          <Item>
            <ItemActions className="flex-none">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={revokingAll}>
                    {revokingAll ? (
                      <>
                        <Spinner className="size-4" />
                        <span>Revoking all</span>
                      </>
                    ) : (
                      <span>{`Revoke All Other Sessions (${otherSessions.length})`}</span>
                    )}
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
                        {revokingAll ? (
                          <>
                            <Spinner className="size-4" />
                            <span>Revoking</span>
                          </>
                        ) : (
                          <span>Revoke All</span>
                        )}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ItemActions>
          </Item>
        ) : null}
      </ItemGroup>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session['id']}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono">{session['id']?.substring(0, 8) || 'Unknown'}</p>
                      {session.is_current && <Badge variant="default">Current</Badge>}
                    </div>
                    {session['is_suspicious'] && (
                      <Badge variant="destructive" className="text-xs">Suspicious</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{session['is_active'] ? 'Active' : 'Inactive'}</p>
                    <p className="text-xs text-muted-foreground">{getActivityStatus(session['updated_at'])}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{formatDate(session['created_at'])}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{formatDate(session['updated_at'])}</p>
                </TableCell>
                <TableCell>
                  {!session.is_current && session['id'] ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void handleRevokeSession(session['id'] as string)}
                      disabled={revokingId === session['id']}
                    >
                      {revokingId === session['id'] ? (
                        <>
                          <Spinner className="size-4" />
                          <span>Revoking</span>
                        </>
                      ) : (
                        <span>Revoke</span>
                      )}
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

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
