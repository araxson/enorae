import { Activity, CalendarCheck, CalendarX, Clock4, DollarSign, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { AppointmentSnapshot } from '@/features/admin/appointments/types'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
    <ItemGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map(({ title, icon: Icon, value, helper, badge }) => (
        <Item key={title} variant="outline" className="flex-col items-start gap-4">
          <ItemMedia variant="icon">
            <Icon className="size-4" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <span className="text-2xl font-semibold">{value}</span>
            <ItemDescription>{helper}</ItemDescription>
          </ItemContent>
          {badge ? (
            <ItemActions>
              <Badge variant="destructive">{badge}</Badge>
            </ItemActions>
          ) : null}
        </Item>
      ))}
    </ItemGroup>
  )
}
