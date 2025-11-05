import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
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
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { Star } from 'lucide-react'

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
      <CardHeader>
        <div className="pb-4">
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Performance Benchmarks</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                key: 'utilization',
                label: 'Avg. utilization',
                value: formatPercent(performance.avgUtilization),
              },
              {
                key: 'revenue',
                label: 'Revenue per salon (30d)',
                value: formatCurrencyCompact(performance.revenuePerSalon),
              },
              {
                key: 'appointments',
                label: 'Appointments per salon',
                value: performance.appointmentsPerSalon.toFixed(1),
              },
            ].map(({ key, label, value }) => (
              <Item key={key} variant="outline">
                <ItemContent>
                  <div className="flex flex-col items-start gap-2 text-sm">
                    <ItemDescription>{label}</ItemDescription>
                    <span className="text-xl font-semibold">{value}</span>
                  </div>
                </ItemContent>
              </Item>
            ))}
          </div>

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
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="size-3 fill-accent text-accent" aria-hidden="true" />
                          {salon.ratingAverage.toFixed(1)}
                        </span>
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
        </div>
      </CardContent>
    </Card>
  )
}
