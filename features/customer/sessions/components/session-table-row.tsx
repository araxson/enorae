'use client'


import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import type { SessionWithDevice } from '@/features/customer/sessions/api/queries'

interface SessionTableRowProps {
  session: SessionWithDevice
  revokingId: string | null
  onRevoke: (sessionId: string) => void
  formatDate: (date: string | null) => string
  getActivityStatus: (lastActivity: string | null) => string
}

export function SessionTableRow({
  session,
  revokingId,
  onRevoke,
  formatDate,
  getActivityStatus,
}: SessionTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Item size="sm">
          <ItemContent>
            <ItemTitle>{session['id']?.substring(0, 8) || 'Unknown'}</ItemTitle>
            <div className="flex flex-wrap gap-2">
              {session.is_current ? <Badge variant="default">Current</Badge> : null}
              {session['is_suspicious'] ? <Badge variant="destructive">Suspicious</Badge> : null}
            </div>
          </ItemContent>
        </Item>
      </TableCell>
      <TableCell>
        <Item size="sm">
          <ItemContent>
            <ItemTitle>{session['is_active'] ? 'Active' : 'Inactive'}</ItemTitle>
            <ItemDescription>{getActivityStatus(session['updated_at'])}</ItemDescription>
          </ItemContent>
        </Item>
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
            onClick={() => onRevoke(session['id'] as string)}
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
  )
}
