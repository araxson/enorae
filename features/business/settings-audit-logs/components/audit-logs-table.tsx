'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, XCircle, Eye, Download } from 'lucide-react'
import type { AuditLog } from '../api/queries'

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
      <Card>
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Audit Log Entries</h3>
            <p className="text-sm text-muted-foreground">
              Showing {logs.length} entries
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={exportLogs} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
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
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{log.entity_type}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.ip_address || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {log.is_success ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Failed
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
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this audit log entry
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                  <p className="font-mono text-sm">{formatDate(selectedLog.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Action</p>
                  <p className="capitalize">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entity Type</p>
                  <p className="capitalize">{selectedLog.entity_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entity ID</p>
                  <p className="font-mono text-sm">{selectedLog.entity_id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm">{selectedLog.user_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                  <p className="font-mono text-sm">{selectedLog.ip_address || 'N/A'}</p>
                </div>
              </div>

              {selectedLog.user_agent && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">User Agent</p>
                  <p className="text-sm bg-muted p-2 rounded font-mono break-all">
                    {selectedLog.user_agent}
                  </p>
                </div>
              )}

              {selectedLog.old_values && Object.keys(selectedLog.old_values).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Old Values</p>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                    {JSON.stringify(selectedLog.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.new_values && Object.keys(selectedLog.new_values).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">New Values</p>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                    {JSON.stringify(selectedLog.new_values, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.error_message && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Error Message</p>
                  <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                    {selectedLog.error_message}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
