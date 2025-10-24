import { ShieldCheck, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PlatformAnalyticsSnapshot } from '@/features/admin/analytics/api/admin-analytics-types'

interface RetentionPanelProps {
  retention: PlatformAnalyticsSnapshot['retention']
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

export function RetentionPanel({ retention }: RetentionPanelProps) {
  const series = retention.series.slice(-10).reverse()

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <CardTitle>Retention &amp; Churn</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Retention rate</p>
            <p className="text-2xl font-semibold">{formatPercent(retention.retentionRate)}</p>
            <p className="text-xs text-muted-foreground">
              {retention.returningCustomers.toLocaleString('en-US')} returning customers
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3" />
              Churn rate
            </p>
            <p className="text-2xl font-semibold">{formatPercent(retention.churnRate)}</p>
            <p className="text-xs text-muted-foreground">
              Based on cancelled appointments
            </p>
          </div>
        </div>

        {series.length === 0 ? (
          <p className="text-sm text-muted-foreground">Not enough data to render retention trend.</p>
        ) : (
          <div className="overflow-x-auto">
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
