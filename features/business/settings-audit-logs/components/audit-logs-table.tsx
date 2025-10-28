'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCircle2, XCircle, Eye, Download } from 'lucide-react'
import type { AuditLog } from '@/features/business/settings-audit-logs/api/queries'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { AuditLogDetailsDialog } from './audit-log-details-dialog'

interface AuditLogsTableProps {
  logs: AuditLog[]
  onExport: () => void
}

export function AuditLogsTable({ logs, onExport }: AuditLogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatActionLabel = (action: string) =>
    action
      .split('_')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ')

  const exportLogs = () => {
    const csv = [
      ['Date', 'Action', 'Entity Type', 'User ID', 'IP Address', 'Status', 'Error'].join(','),
      ...logs.map(log => [
        formatDate(log.created_at),
        log.action,
        log.entity_type,
        log.user_id,
        log.ip_address || 'N/A',
        log.is_success ? 'Success' : 'Failed',
        log.error_message || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <ItemTitle>Audit log entries</ItemTitle>
            <ItemDescription>Showing {logs.length} entries</ItemDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportLogs} className="gap-2">
            <Download className="size-4" />
            Export CSV
          </Button>
        </ItemHeader>

        <ItemContent className="p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Empty>
                        <EmptyHeader>
                          <EmptyTitle>No audit logs found</EmptyTitle>
                          <EmptyDescription>Activity will appear here once audits are recorded.</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>Enable logging or perform actions to populate this table.</EmptyContent>
                      </Empty>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{formatActionLabel(log.action)}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{log.entity_type}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.ip_address || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {log.is_success ? (
                          <Badge variant="default">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="size-3" />
                              Success
                            </span>
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <span className="flex items-center gap-1">
                              <XCircle className="size-3" />
                              Failed
                            </span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          className="gap-2"
                        >
                          <Eye className="size-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </ItemContent>
      </Item>

      <AuditLogDetailsDialog
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </>
  )
}
