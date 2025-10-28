import { ShieldCheck, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PlatformAnalyticsSnapshot } from '@/features/admin/analytics/api/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface RetentionPanelProps {
  retention: PlatformAnalyticsSnapshot['retention']
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

export function RetentionPanel({ retention }: RetentionPanelProps) {
  const series = retention.series.slice(-10).reverse()

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <ItemGroup>
          <Item variant="muted">
            <ItemMedia variant="icon">
              <ShieldCheck className="h-4 w-4" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Retention &amp; Churn</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-4">
        <ItemGroup className="grid gap-4 text-sm sm:grid-cols-2">
          <Item variant="muted" size="sm" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemDescription>Retention rate</ItemDescription>
              <span className="text-2xl font-semibold">
                {formatPercent(retention.retentionRate)}
              </span>
              <ItemDescription>
                {retention.returningCustomers.toLocaleString('en-US')} returning customers
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted" size="sm" className="flex-col items-start gap-2">
            <ItemContent>
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <ItemDescription>Churn rate</ItemDescription>
              </span>
              <span className="text-2xl font-semibold">
                {formatPercent(retention.churnRate)}
              </span>
              <ItemDescription>Based on cancelled appointments</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <ScrollArea className="w-full">
          {series.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Retention trend unavailable</EmptyTitle>
                <EmptyDescription>Collect additional retention snapshots to populate this table.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Retention</TableHead>
                  <TableHead className="text-right">Churn</TableHead>
                  <TableHead className="text-right">New</TableHead>
                  <TableHead className="text-right">Returning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {series.map((point) => (
                  <TableRow key={point.date}>
                    <TableCell className="font-medium text-foreground">
                      {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right">{formatPercent(point.retentionRate)}</TableCell>
                    <TableCell className="text-right">{formatPercent(point.churnRate)}</TableCell>
                    <TableCell className="text-right">{point.newCustomers.toLocaleString('en-US')}</TableCell>
                    <TableCell className="text-right">{point.returningCustomers.toLocaleString('en-US')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {series.length === 0 ? null : <ScrollBar orientation="horizontal" />}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
