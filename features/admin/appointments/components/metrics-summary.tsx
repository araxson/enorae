import { Activity, CalendarCheck, CalendarX, Clock4, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AppointmentSnapshot } from '@/features/admin/appointments/api/types'

interface MetricsSummaryProps {
  totals: AppointmentSnapshot['totals']
  performance: AppointmentSnapshot['performance']
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`
const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
const formatMinutes = (value: number) => `${Math.round(value)} min`

export function MetricsSummary({ totals, performance }: MetricsSummaryProps) {
  const items = [
    {
      title: 'Total Appointments',
      icon: Activity,
      value: totals.total.toLocaleString('en-US'),
      helper: `${totals.upcoming} upcoming · ${totals.inProgress} active`,
    },
    {
      title: 'Completion Rate',
      icon: CalendarCheck,
      value: formatPercent(performance.completionRate),
      helper: `${totals.completed.toLocaleString('en-US')} completed`,
    },
    {
      title: 'Cancellation Rate',
      icon: CalendarX,
      value: formatPercent(performance.cancellationRate),
      helper: `${totals.cancelled.toLocaleString('en-US')} cancelled`,
    },
    {
      title: 'No-Show Rate',
      icon: CalendarX,
      value: formatPercent(performance.noShowRate),
      helper: `${totals.noShow.toLocaleString('en-US')} no-shows`,
      badge: performance.noShowRate > 0.1 ? 'High risk' : undefined,
    },
    {
      title: 'Total Revenue',
      icon: DollarSign,
      value: formatCurrency(performance.totalRevenue),
      helper: `Avg ticket ${formatCurrency(performance.averageTicket)}`,
    },
    {
      title: 'Average Duration',
      icon: Clock4,
      value: formatMinutes(performance.averageDuration),
      helper: 'Across completed appointments',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map(({ title, icon: Icon, value, helper, badge }) => (
        <Card key={title}>
          <CardHeader className="flex items-start justify-between pb-2">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <CardTitle>{title}</CardTitle>
            </div>
            {badge && <Badge variant="destructive">{badge}</Badge>}
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold">{value}</div>
            <p className="text-xs text-muted-foreground">{helper}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
