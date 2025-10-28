import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { PlatformAnalyticsSnapshot } from '@/features/admin/analytics/api/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item'

interface GrowthTrendPanelProps {
  series: PlatformAnalyticsSnapshot['growth']['series']
  timeframe: PlatformAnalyticsSnapshot['timeframe']
}

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatCurrencyCompact = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value)

export function GrowthTrendPanel({ series }: GrowthTrendPanelProps) {
  const rows = series.slice(-14).reverse()

  const hasRows = rows.length > 0

  return (
    <div className="h-full">
      <Card>
        <CardHeader>
          <div className="pb-4">
            <ItemGroup>
              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>Growth Trend (Last 14 snapshots)</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            {hasRows ? (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Appointments</TableHead>
                  <TableHead className="text-right">New Customers</TableHead>
                  <TableHead className="text-right">Returning</TableHead>
                  <TableHead className="text-right">Active Salons</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((entry) => (
                  <TableRow key={entry.date}>
                    <TableCell className="font-medium text-foreground">{formatDate(entry.date)}</TableCell>
                    <TableCell className="text-right">{formatCurrencyCompact(entry.revenue)}</TableCell>
                    <TableCell className="text-right">{entry.appointments.toLocaleString('en-US')}</TableCell>
                    <TableCell className="text-right">{entry.newCustomers.toLocaleString('en-US')}</TableCell>
                    <TableCell className="text-right">{entry.returningCustomers.toLocaleString('en-US')}</TableCell>
                    <TableCell className="text-right">{entry.activeSalons.toLocaleString('en-US')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No analytics snapshots available</EmptyTitle>
                <EmptyDescription>Growth metrics populate after the first data refresh window.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
            {hasRows ? <ScrollBar orientation="horizontal" /> : null}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
