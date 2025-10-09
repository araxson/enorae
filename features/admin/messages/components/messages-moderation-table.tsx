import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Muted } from '@/components/ui/typography'
import { formatDistanceToNow } from 'date-fns'
import type { ModerationQueueItem } from '../api/queries'

interface MessagesModerationTableProps {
  items: ModerationQueueItem[]
}

const severityVariant = (severity: ModerationQueueItem['severity']) => {
  switch (severity) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'secondary'
    default:
      return 'outline'
  }
}

export function MessagesModerationTable({ items }: MessagesModerationTableProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Moderation Queue</CardTitle>
        <CardDescription>Recently flagged messages requiring review</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <Muted>No flagged messages in the selected period.</Muted>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-[260px]">
                      <p className="text-sm font-medium leading-tight line-clamp-3">
                        {item.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.customerName ?? 'Customer'} • {item.salonName ?? 'Salon'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={severityVariant(item.severity)} className="mb-1">
                        {item.severity}
                      </Badge>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.reason}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
