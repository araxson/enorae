import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { MessageActivityPoint } from '@/features/admin/messages/api/queries'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

interface MessagesActivityTableProps {
  activity: MessageActivityPoint[]
}

const formatMinutes = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return '—'
  if (value < 1) return '<1m'
  const hours = Math.floor(value / 60)
  const minutes = Math.round(value % 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function MessagesActivityTable({ activity }: MessagesActivityTableProps) {
  const totalInbound = activity.reduce((sum, item) => sum + item.inbound, 0)
  const totalOutbound = activity.reduce((sum, item) => sum + item.outbound, 0)
  const hasVolume = activity.some((point) => point.inbound > 0 || point.outbound > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>30-Day Activity</CardTitle>
        <CardDescription>Inbound vs outbound volume and average response time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="w-full">
          {hasVolume ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Inbound</TableHead>
                  <TableHead className="text-right">Outbound</TableHead>
                  <TableHead className="text-right">Avg Response</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity.map((point) => (
                  <TableRow key={point.date}>
                    <TableCell>{point.date}</TableCell>
                    <TableCell className="text-right">{point.inbound}</TableCell>
                    <TableCell className="text-right">{point.outbound}</TableCell>
                    <TableCell className="text-right">
                      {formatMinutes(point.avgResponseMinutes)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell className="text-right font-medium">{totalInbound}</TableCell>
                  <TableCell className="text-right font-medium">{totalOutbound}</TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No message activity recorded</EmptyTitle>
                <EmptyDescription>Inbound and outbound messages will populate after the first interactions.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          {hasVolume ? <ScrollBar orientation="horizontal" /> : null}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
