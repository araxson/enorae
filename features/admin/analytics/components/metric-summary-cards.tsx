import { ArrowUpRight, ArrowDownRight, Users, Store, CalendarDays, PieChart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { PlatformAnalyticsSnapshot, GrowthDelta } from '@/features/admin/analytics/api/types'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
    <ItemGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, icon: Icon, value, helper, delta }) => (
        <Item key={title} variant="outline" className="flex-col items-start gap-4">
          <ItemMedia variant="icon">
            <Icon className="h-4 w-4" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <span className="text-2xl font-semibold">{value}</span>
            <ItemDescription>{helper}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant={delta.variant}>
              {delta.icon ? <delta.icon className="mr-1 h-3 w-3" /> : null}
              {delta.label}
            </Badge>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
