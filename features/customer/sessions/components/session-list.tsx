'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { revokeSession, revokeAllOtherSessions } from '@/features/customer/sessions/api/mutations'
import type { SessionWithDevice } from '@/features/customer/sessions/api/queries'
import { formatDateTime } from '@/lib/utils/date-time'
import { getActivityStatus } from '../utils/session-helpers'
import { SessionTableRow } from './session-table-row'
import { RevokeAllDialog } from './revoke-all-dialog'
import { UI_TIMEOUTS } from '@/lib/config/constants'

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
      }, UI_TIMEOUTS.NAVIGATION_DELAY)
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
            <Info className="size-6" aria-hidden="true" />
          </EmptyMedia>
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
        <RevokeAllDialog
          otherSessionsCount={otherSessions.length}
          revokingAll={revokingAll}
          onRevokeAll={handleRevokeAll}
        />
      </ItemGroup>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle2 className="size-4" />
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
                  <SessionTableRow
                    key={session['id']}
                    session={session}
                    revokingId={revokingId}
                    onRevoke={handleRevokeSession}
                    formatDate={formatDateTime}
                    getActivityStatus={getActivityStatus}
                  />
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
