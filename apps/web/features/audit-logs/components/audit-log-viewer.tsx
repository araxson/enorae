import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@enorae/ui'
import { Badge } from '@enorae/ui'
import { getAuditLogs } from '../dal/queries'

export async function AuditLogViewer({ salonId }: { salonId?: string }) {
  const logs = await getAuditLogs(salonId)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Resource</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(logs as any[]).map((log: any) => (
          <TableRow key={log.id}>
            <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
            <TableCell>{log.profiles?.full_name || 'System'}</TableCell>
            <TableCell>
              <Badge variant={log.action === 'DELETE' ? 'destructive' : 'secondary'}>
                {log.action}
              </Badge>
            </TableCell>
            <TableCell>{log.resource_type}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {JSON.stringify(log.changes).substring(0, 50)}...
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}