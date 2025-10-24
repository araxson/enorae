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
import { MoreHorizontal, ShieldAlert } from 'lucide-react'
import type { SessionSecurityRecord } from '@/features/admin/session-security/api/queries'
import {
  quarantineSession,
  requireMfaForUser,
  evictSession,
  overrideSeverity,
} from '@/features/admin/session-security/api/mutations'

interface SessionSecurityTableProps {
  records: SessionSecurityRecord[]
}

export function SessionSecurityTable({ records }: SessionSecurityTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleQuarantine = async (sessionId: string, email: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('sessionId', sessionId)
      formData.append('reason', `Quarantine initiated by admin for ${email}`)
      const result = await quarantineSession(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Session quarantined')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequireMfa = async (userId: string, email: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('userId', userId)
      formData.append('reason', `MFA requirement enforced for ${email}`)
      const result = await requireMfaForUser(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('MFA requirement set')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEvict = async (sessionId: string, email: string) => {
    if (!confirm(`Evict session for ${email}? This cannot be undone.`)) return
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('sessionId', sessionId)
      formData.append('reason', `Session evicted by admin for security`)
      const result = await evictSession(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Session evicted')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      case 'high':
        return <Badge variant="outline">High</Badge>
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 80) return 'text-destructive'
    if (riskScore >= 60) return 'text-primary'
    if (riskScore >= 40) return 'text-secondary'
    return 'text-foreground'
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead>MFA Status</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Security Flags</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No session security records found
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
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
                <TableCell>
                  {record.security_flags.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <ShieldAlert className="h-4 w-4 text-destructive" />
                      <span className="text-sm">{record.security_flags.length} flags</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(record.last_activity), 'MMM dd, HH:mm')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleQuarantine(record.id, record.user_email)}
                        disabled={isLoading}
                      >
                        Quarantine Session
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRequireMfa(record.user_id, record.user_email)}
                        disabled={isLoading || record.has_mfa}
                      >
                        Require MFA
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEvict(record.id, record.user_email)}
                        disabled={isLoading}
                        className="text-destructive"
                      >
                        Evict Session
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
