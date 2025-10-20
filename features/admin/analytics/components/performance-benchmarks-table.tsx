import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PlatformAnalyticsSnapshot } from '../api/admin-analytics-types'

interface PerformanceBenchmarksTableProps {
  performance: PlatformAnalyticsSnapshot['performance']
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`
const formatCurrencyCompact = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value)

export function PerformanceBenchmarksTable({ performance }: PerformanceBenchmarksTableProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Performance Benchmarks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 text-sm md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Avg. utilization</p>
            <p className="text-xl font-semibold text-foreground">{formatPercent(performance.avgUtilization)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Revenue per salon (30d)</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrencyCompact(performance.revenuePerSalon)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Appointments per salon</p>
            <p className="text-xl font-semibold text-foreground">{performance.appointmentsPerSalon.toFixed(1)}</p>
          </div>
        </div>

        {performance.topSalons.length === 0 ? (
          <p className="text-sm text-muted-foreground">No salon-level benchmarks available.</p>
        ) : (
          <div className="overflow-x-auto">
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
                    <TableCell className="font-medium text-foreground">
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
