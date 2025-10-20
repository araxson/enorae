import { ArrowUpRight, ArrowDownRight, Users, Store, CalendarDays, PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PlatformAnalyticsSnapshot, GrowthDelta } from '../api/admin-analytics-types'

interface MetricSummaryCardsProps {
  growth: PlatformAnalyticsSnapshot['growth']['summary']
  acquisition: PlatformAnalyticsSnapshot['acquisition']
  retention: PlatformAnalyticsSnapshot['retention']
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

const formatDelta = (delta: GrowthDelta) => {
  if (delta.delta === 0) {
    return { label: 'No change', variant: 'outline' as const, icon: null }
  }
  const increase = delta.delta > 0
  return {
    label: `${increase ? '+' : ''}${formatPercent(delta.deltaPercent)}`,
    variant: increase ? ('secondary' as const) : ('destructive' as const),
    icon: increase ? ArrowUpRight : ArrowDownRight,
  }
}

export function MetricSummaryCards({ growth, acquisition, retention }: MetricSummaryCardsProps) {
  const cards = [
    {
      title: 'Platform Revenue (30d)',
      icon: PieChart,
      value: formatCurrency(growth.revenue.current),
      delta: formatDelta(growth.revenue),
      helper: `Prev 30d ${formatCurrency(growth.revenue.previous)}`,
    },
    {
      title: 'New Customers (30d)',
      icon: Users,
      value: acquisition.newUsersLast30Days.toLocaleString('en-US'),
      delta: formatDelta(growth.newCustomers),
      helper: `Δ 7d ${acquisition.deltaLast7Days >= 0 ? '+' : ''}${acquisition.deltaLast7Days.toLocaleString('en-US')}`,
    },
    {
      title: 'Active Salons (avg)',
      icon: Store,
      value: Math.round(growth.activeSalons.current).toLocaleString('en-US'),
      delta: formatDelta(growth.activeSalons),
      helper: `Prev avg ${Math.round(growth.activeSalons.previous).toLocaleString('en-US')}`,
    },
    {
      title: 'Appointments (30d)',
      icon: CalendarDays,
      value: growth.appointments.current.toLocaleString('en-US'),
      delta: formatDelta(growth.appointments),
      helper: `Retention ${formatPercent(retention.retentionRate)}`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, icon: Icon, value, helper, delta }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <CardTitle>{title}</CardTitle>
            </div>
            {delta.icon ? (
              <Badge variant={delta.variant} className="flex items-center gap-1 text-xs">
                <delta.icon className="h-3 w-3" />
                {delta.label}
              </Badge>
            ) : (
              <Badge variant={delta.variant} className="text-xs">
                {delta.label}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <p className="text-xs text-muted-foreground">{helper}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
