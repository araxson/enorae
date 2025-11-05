'use client'
import {
  Activity,
  Calendar,
  DollarSign,
  Users,
} from 'lucide-react'
import { MetricCard } from './metric-card'
import type { DailyMetricsDashboardProps } from '../../api/types'
import { formatCurrency } from '@/features/business/common'

type Props = Pick<DailyMetricsDashboardProps, 'aggregated' | 'trends'>

export function KeyMetricsGrid({ aggregated, trends }: Props) {
  const completionRate =
    aggregated.totalAppointments > 0
      ? (aggregated.completedAppointments / aggregated.totalAppointments) * 100
      : 0

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(aggregated.totalRevenue)}
        trend={trends.revenue}
        icon={DollarSign}
        subtitle={`${formatCurrency(aggregated.serviceRevenue)} services, ${formatCurrency(
          aggregated.productRevenue
        )} products`}
      />
      <MetricCard
        title="Appointments"
        value={aggregated.totalAppointments}
        trend={trends.appointments}
        icon={Calendar}
        subtitle={`${aggregated.completedAppointments} completed (${completionRate.toFixed(1)}%)`}
      />
      <MetricCard
        title="Customers"
        value={aggregated.newCustomers + aggregated.returningCustomers}
        trend={trends.customers}
        icon={Users}
        subtitle={`${aggregated.newCustomers} new, ${aggregated.returningCustomers} returning`}
      />
      <MetricCard
        title="Utilization"
        value={`${aggregated.avgUtilization.toFixed(1)}%`}
        trend={trends.utilization}
        icon={Activity}
        subtitle="Average staff utilization"
      />
    </div>
  )
}
