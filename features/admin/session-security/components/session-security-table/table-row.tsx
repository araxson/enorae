'use client'

import { format } from 'date-fns'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import type { SessionSecurityRecord } from '@/features/admin/session-security/api/queries'
import { getRiskBadge, getRiskColor, renderSecurityFlags } from './utils'

interface SessionSecurityTableRowProps {
  record: SessionSecurityRecord
  isLoading: boolean
  onQuarantine: (sessionId: string, email: string) => Promise<void>
  onRequireMfa: (userId: string, email: string) => Promise<void>
  onEvict: (sessionId: string, email: string) => Promise<void>
}

/**
 * Session security table row component
 */
export function SessionSecurityTableRow({
  record,
  isLoading,
  onQuarantine,
  onRequireMfa,
  onEvict,
}: SessionSecurityTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{record.user_email}</TableCell>
      <TableCell className={`font-semibold ${getRiskColor(record.risk_score)}`}>
        {record.risk_score}%
      </TableCell>
      <TableCell>{getRiskBadge(record.risk_level)}</TableCell>
      <TableCell>
        {record.has_mfa ? (
          <Badge variant="secondary">Enabled</Badge>
        ) : (
          <Badge variant="outline">Disabled</Badge>
        )}
      </TableCell>
      <TableCell className="font-mono text-sm">{record.ip_address}</TableCell>
      <TableCell>{renderSecurityFlags(record.security_flags)}</TableCell>
      <TableCell className="text-sm">
        {format(new Date(record.last_activity), 'MMM dd, HH:mm')}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Open session actions for ${record.user_email ?? 'user'}`}
              disabled={isLoading}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onQuarantine(record.id, record.user_email)}
              disabled={isLoading}
            >
              Quarantine Session
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onRequireMfa(record.user_id, record.user_email)}
              disabled={isLoading || record.has_mfa}
            >
              Require MFA
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEvict(record.id, record.user_email)}
              disabled={isLoading}
              className="text-destructive"
            >
              Evict Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
