'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { MoreHorizontal } from 'lucide-react'
import type { SecurityAccessRecord } from '@/features/admin/security-access-monitoring/api/queries'
import {
  acknowledgeSecurityAlert,
  dismissSecurityAlert,
  suppressSecurityAlert,
} from '@/features/admin/security-access-monitoring/api/mutations'

interface SecurityAccessTableProps {
  records: SecurityAccessRecord[]
}

export function SecurityAccessTable({ records }: SecurityAccessTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAcknowledge = async (accessId: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('accessId', accessId)
      const result = await acknowledgeSecurityAlert(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Alert acknowledged')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = async (accessId: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('accessId', accessId)
      const result = await dismissSecurityAlert(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Alert dismissed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuppress = async (
    accessId: string,
    reason: string,
    duration: '1hour' | '1day' | '1week' | 'permanent',
  ) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('accessId', accessId)
      formData.append('reason', reason)
      formData.append('duration', duration)
      const result = await suppressSecurityAlert(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Alert suppressed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'blocked':
        return <Badge variant="destructive">Blocked</Badge>
      case 'flagged':
        return <Badge variant="outline">Flagged</Badge>
      case 'success':
        return <Badge variant="secondary">Success</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getAckBadge = (ackStatus: string) => {
    switch (ackStatus) {
      case 'acknowledged':
        return <Badge variant="secondary">Acknowledged</Badge>
      case 'dismissed':
        return <Badge variant="outline">Dismissed</Badge>
      case 'pending':
        return <Badge variant="default">Pending</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 80) return 'text-red-600'
    if (riskScore >= 60) return 'text-orange-600'
    if (riskScore >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Access Type</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead className={getRiskColor(50)}>Risk Score</TableHead>
            <TableHead>Acknowledgement</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No security access records found
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
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
                        size="sm"
                        disabled={isLoading}
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleAcknowledge(record.id)}
                        disabled={isLoading}
                      >
                        Acknowledge
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDismiss(record.id)}
                        disabled={isLoading}
                      >
                        Dismiss
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSuppress(record.id, 'Reviewed', '1day')}
                        disabled={isLoading}
                      >
                        Suppress for 1 day
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
