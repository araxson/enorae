import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AppointmentTrendPoint } from '@/features/admin/appointments/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item'

interface TrendTableProps {
  trend: AppointmentTrendPoint[]
}

const formatDate = (value: string) => new Date(value).toLocaleDateString()

export function TrendTable({ trend }: TrendTableProps) {
  const rows = trend.slice(-14)

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>14-day Trend</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          {rows.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No trend data yet</EmptyTitle>
                <EmptyDescription>Supabase exports will populate this table once available.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Cancelled</TableHead>
                  <TableHead>No-shows</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((entry) => (
                  <TableRow key={entry.date}>
                    <TableCell className="font-medium text-foreground">{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.total}</TableCell>
                    <TableCell>{entry.completed}</TableCell>
                    <TableCell>{entry.cancelled}</TableCell>
                    <TableCell>{entry.noShow}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {rows.length === 0 ? null : <ScrollBar orientation="horizontal" />}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
