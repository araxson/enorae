'use client'

import { format } from 'date-fns'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import type { SecurityAccessRecord } from '@/features/admin/security-access-monitoring/api/queries'
import { getStatusBadge, getAckBadge, getRiskColor } from './utils'

interface SecurityAccessTableRowProps {
  record: SecurityAccessRecord
  isLoading: boolean
  onAcknowledge: (accessId: string) => Promise<void>
  onDismiss: (accessId: string) => Promise<void>
  onSuppress: (accessId: string, reason: string, duration: '1hour' | '1day' | '1week' | 'permanent') => Promise<void>
}

/**
 * Security access table row component
 */
export function SecurityAccessTableRow({
  record,
  isLoading,
  onAcknowledge,
  onDismiss,
  onSuppress,
}: SecurityAccessTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{record.user_email}</TableCell>
      <TableCell>{record.access_type}</TableCell>
      <TableCell className="font-mono text-sm">{record.endpoint}</TableCell>
      <TableCell>{getStatusBadge(record.status)}</TableCell>
      <TableCell className="font-mono text-sm">{record.ip_address}</TableCell>
      <TableCell className={`font-semibold ${getRiskColor(record.risk_score)}`}>
        {record.risk_score}%
      </TableCell>
      <TableCell>{getAckBadge(record.acknowledgement_status)}</TableCell>
      <TableCell className="text-sm">
        {format(new Date(record.accessed_at), 'MMM dd, HH:mm')}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Open actions for ${record.user_email ?? 'security event'}`}
              disabled={isLoading}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAcknowledge(record.id)} disabled={isLoading}>
              Acknowledge
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDismiss(record.id)} disabled={isLoading}>
              Dismiss
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSuppress(record.id, 'Reviewed', '1day')}
              disabled={isLoading}
            >
              Suppress for 1 day
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
