'use client'

import { memo } from 'react'
import { format } from 'date-fns'
import { Monitor, Smartphone, Tablet, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import type { StaffSessionDetail } from '@/features/staff/sessions/api/types'

type SessionRowProps = {
  session: StaffSessionDetail
  isCurrent: boolean
  isRevoking: boolean
  pendingSessionId: string | null
  onRevoke: (sessionId: string) => void
}

function getDeviceIcon(deviceType: string | null | undefined) {
  switch (deviceType?.toLowerCase()) {
    case 'mobile':
      return <Smartphone className="size-4" />
    case 'tablet':
      return <Tablet className="size-4" />
    default:
      return <Monitor className="size-4" />
  }
}

export const SessionRow = memo(function SessionRow({
  session,
  isCurrent,
  isRevoking,
  pendingSessionId,
  onRevoke,
}: SessionRowProps) {
  const lastActiveValue = typeof session.last_active_at === "string" ? session.last_active_at : null
  const parsedLastActive = lastActiveValue ? new Date(lastActiveValue) : null
  const formattedLastActive = parsedLastActive ? format(parsedLastActive, 'PPp') : 'Never'

  return (
    <TableRow>
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
            onClick={() => session['id'] && onRevoke(session['id'])}
            disabled={isRevoking && pendingSessionId === session['id']}
            aria-label="Revoke session"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </TableCell>
    </TableRow>
  )
})
