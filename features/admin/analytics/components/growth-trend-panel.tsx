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

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Growth Trend (Last 14 snapshots)</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No analytics snapshots available yet.</p>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
