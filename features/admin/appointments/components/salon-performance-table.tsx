import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SalonPerformance } from '@/features/admin/appointments/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item'

interface SalonPerformanceTableProps {
  salons: SalonPerformance[]
}

const formatPercent = (num: number, denom: number) => {
  if (!denom) return '0%'
  return `${((num / denom) * 100).toFixed(1)}%`
}

export function SalonPerformanceTable({ salons }: SalonPerformanceTableProps) {
  return (
    <div className="h-full">
      <Card>
        <CardHeader>
          <div className="pb-4">
            <ItemGroup>
              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>Top Performing Salons</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
          {salons.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No salon metrics returned</EmptyTitle>
                <EmptyDescription>Performance insights appear once salons accumulate appointment activity.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Salon</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Cancellation %</TableHead>
                  <TableHead>No-show %</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Avg Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salons.map((salon) => (
                  <TableRow key={salon.salonId}>
                    <TableCell className="font-medium text-foreground">{salon.salonName || salon.salonId}</TableCell>
                    <TableCell>{salon.total}</TableCell>
                    <TableCell>{salon.completed}</TableCell>
                    <TableCell>{formatPercent(salon.cancelled, salon.total)}</TableCell>
                    <TableCell>{formatPercent(salon.noShow, salon.total)}</TableCell>
                    <TableCell>${salon.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</TableCell>
                    <TableCell>{Math.round(salon.avgDuration)} min</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {salons.length === 0 ? null : <ScrollBar orientation="horizontal" />}
        </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
