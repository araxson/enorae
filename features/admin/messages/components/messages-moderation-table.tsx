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
import { formatDistanceToNow } from 'date-fns'
import type { ModerationQueueItem } from '@/features/admin/messages/api/queries'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'

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
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Moderation Queue</CardTitle>
              <CardDescription>Recently flagged messages requiring review</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="w-full">
          {items.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No flagged messages</EmptyTitle>
                <EmptyDescription>The moderation queue is clear for the selected period.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
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
                    <TableCell className="max-w-sm">
                      <p className="line-clamp-3 text-sm font-medium leading-tight">
                        {item.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.customerName ?? 'Customer'} • {item.salonName ?? 'Salon'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="mb-1">
                        <Badge variant={severityVariant(item.severity)}>
                          {item.severity.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{item.reason}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {items.length === 0 ? null : <ScrollBar orientation="horizontal" />}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
