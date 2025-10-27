import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { PlatformAnalyticsSnapshot } from '@/features/admin/analytics/api/admin-analytics-types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'

interface PerformanceBenchmarksTableProps {
  performance: PlatformAnalyticsSnapshot['performance']
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`
const formatCurrencyCompact = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value)

export function PerformanceBenchmarksTable({ performance }: PerformanceBenchmarksTableProps) {
  const hasTopSalons = performance.topSalons.length > 0

  return (
    <Card>
      <CardHeader className="pb-4">
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Performance Benchmarks</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-4">
        <ItemGroup className="grid gap-4 md:grid-cols-3">
          <Item variant="outline" className="flex-col items-start gap-2 text-sm">
            <ItemContent>
              <ItemDescription>Avg. utilization</ItemDescription>
              <span className="text-xl font-semibold">{formatPercent(performance.avgUtilization)}</span>
            </ItemContent>
          </Item>
          <Item variant="outline" className="flex-col items-start gap-2 text-sm">
            <ItemContent>
              <ItemDescription>Revenue per salon (30d)</ItemDescription>
              <span className="text-xl font-semibold">{formatCurrencyCompact(performance.revenuePerSalon)}</span>
            </ItemContent>
          </Item>
          <Item variant="outline" className="flex-col items-start gap-2 text-sm">
            <ItemContent>
              <ItemDescription>Appointments per salon</ItemDescription>
              <span className="text-xl font-semibold">{performance.appointmentsPerSalon.toFixed(1)}</span>
            </ItemContent>
          </Item>
        </ItemGroup>

        <ScrollArea className="w-full">
          {hasTopSalons ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Salon</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Appointments</TableHead>
                  <TableHead className="text-right">Utilization</TableHead>
                  <TableHead className="text-right">Rev / Appt</TableHead>
                  <TableHead className="text-right">Tier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performance.topSalons.map((salon) => (
                  <TableRow key={salon.salonId}>
                    <TableCell className="font-medium">
                      {salon.salonName || salon.salonId}
                      {salon.ratingAverage ? (
                        <span className="ml-2 text-xs text-muted-foreground">⭐ {salon.ratingAverage.toFixed(1)}</span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrencyCompact(salon.revenue)}</TableCell>
                    <TableCell className="text-right">{salon.appointments.toLocaleString('en-US')}</TableCell>
                    <TableCell className="text-right">{formatPercent(salon.avgUtilization)}</TableCell>
                    <TableCell className="text-right">{formatCurrencyCompact(salon.revenuePerAppointment)}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {salon.subscriptionTier ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No salon benchmarks available</EmptyTitle>
                <EmptyDescription>Salon performance insights appear after enough historical activity.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          {hasTopSalons ? <ScrollBar orientation="horizontal" /> : null}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
