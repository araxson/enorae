import { Card } from '@/components/ui/card'
import { StatCard } from '@/features/shared/ui-components'
import { DollarSign, TrendingUp, Calendar, Users } from 'lucide-react'
import type { RevenueMetrics } from '@/features/admin/finance/types'

interface RevenueOverviewProps {
  metrics: RevenueMetrics
}

export function RevenueOverview({ metrics }: RevenueOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const completionRate = metrics.totalAppointments > 0
    ? (metrics.completedAppointments / metrics.totalAppointments) * 100
    : 0

  const cancellationRate = metrics.totalAppointments > 0
    ? (metrics.cancelledAppointments / metrics.totalAppointments) * 100
    : 0

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold">Revenue Overview</h3>
        <p className="text-sm text-muted-foreground">
          {metrics.period.start && metrics.period.end
            ? `${metrics.period.start} to ${metrics.period.end}`
            : 'All time'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Service Revenue"
          value={formatCurrency(metrics.serviceRevenue)}
          icon={<TrendingUp className="h-4 w-4" />}
          description={formatPercentage((metrics.serviceRevenue / metrics.totalRevenue) * 100 || 0) + ' of total'}
        />
        <StatCard
          label="Product Revenue"
          value={formatCurrency(metrics.productRevenue)}
          icon={<DollarSign className="h-4 w-4" />}
          description={formatPercentage((metrics.productRevenue / metrics.totalRevenue) * 100 || 0) + ' of total'}
        />
        <StatCard
          label="Avg per Appointment"
          value={formatCurrency(metrics.avgRevenuePerAppointment)}
          icon={<TrendingUp className="h-4 w-4" />}
          description={`${metrics.completedAppointments} completed`}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Appointments"
          value={metrics.totalAppointments.toString()}
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatCard
          label="Completed"
          value={metrics.completedAppointments.toString()}
          icon={<Users className="h-4 w-4" />}
          description={formatPercentage(completionRate) + ' completion rate'}
        />
        <StatCard
          label="Cancelled"
          value={metrics.cancelledAppointments.toString()}
          icon={<Calendar className="h-4 w-4" />}
          description={formatPercentage(cancellationRate) + ' cancellation rate'}
        />
        <StatCard
          label="No Shows"
          value={metrics.noShowAppointments.toString()}
          icon={<Users className="h-4 w-4" />}
          description={formatPercentage((metrics.noShowAppointments / metrics.totalAppointments) * 100 || 0) + ' of total'}
        />
      </div>
    </div>
  )
}
