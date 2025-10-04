'use client'


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Grid } from '@/components/layout'
import { H3, P, Muted } from '@/components/ui/typography'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Activity,
  Scissors,
  Package,
  AlertCircle,
} from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type DailyMetric = Database['public']['Views']['daily_metrics']['Row']

interface DailyMetricsDashboardProps {
  metrics: DailyMetric[]
  aggregated: {
    totalRevenue: number
    totalAppointments: number
    completedAppointments: number
    cancelledAppointments: number
    noShowAppointments: number
    newCustomers: number
    returningCustomers: number
    avgUtilization: number
    serviceRevenue: number
    productRevenue: number
  }
  trends: {
    revenue: number
    appointments: number
    customers: number
    utilization: number
  }
}

export function DailyMetricsDashboard({
  metrics,
  aggregated,
  trends,
}: DailyMetricsDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const MetricCard = ({
    title,
    value,
    trend,
    icon: Icon,
    subtitle,
  }: {
    title: string
    value: string | number
    trend?: number
    icon: React.ComponentType<{ className?: string }>
    subtitle?: string
  }) => (
    <Card>
      <CardContent className="p-6">
        <Stack gap="sm">
          <div className="flex items-center justify-between">
            <Muted className="text-sm">{title}</Muted>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between">
            <H3 className="text-2xl font-bold">{value}</H3>
            {trend !== undefined && (
              <Badge
                variant={trend >= 0 ? 'default' : 'destructive'}
                className="flex items-center gap-1"
              >
                {trend >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPercentage(trend)}
              </Badge>
            )}
          </div>
          {subtitle && <Muted className="text-xs">{subtitle}</Muted>}
        </Stack>
      </CardContent>
    </Card>
  )

  const completionRate =
    aggregated.totalAppointments > 0
      ? (aggregated.completedAppointments / aggregated.totalAppointments) * 100
      : 0

  const cancellationRate =
    aggregated.totalAppointments > 0
      ? (aggregated.cancelledAppointments / aggregated.totalAppointments) * 100
      : 0

  const noShowRate =
    aggregated.totalAppointments > 0
      ? (aggregated.noShowAppointments / aggregated.totalAppointments) * 100
      : 0

  return (
    <Stack gap="xl">
      {/* Key Metrics */}
      <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="lg">
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
      </Grid>

      {/* Additional Metrics */}
      <Grid cols={{ base: 1, md: 3 }} gap="lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Service Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <H3 className="text-xl">{formatCurrency(aggregated.serviceRevenue)}</H3>
              <Muted className="text-xs">
                {aggregated.totalRevenue > 0
                  ? `${((aggregated.serviceRevenue / aggregated.totalRevenue) * 100).toFixed(1)}% of total`
                  : '0% of total'}
              </Muted>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <H3 className="text-xl">{formatCurrency(aggregated.productRevenue)}</H3>
              <Muted className="text-xs">
                {aggregated.totalRevenue > 0
                  ? `${((aggregated.productRevenue / aggregated.totalRevenue) * 100).toFixed(1)}% of total`
                  : '0% of total'}
              </Muted>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Appointment Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Muted className="text-sm">Cancelled</Muted>
                <div className="flex items-center gap-2">
                  <P className="text-sm font-medium">{aggregated.cancelledAppointments}</P>
                  <Muted className="text-xs">({cancellationRate.toFixed(1)}%)</Muted>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Muted className="text-sm">No-Shows</Muted>
                <div className="flex items-center gap-2">
                  <P className="text-sm font-medium">{aggregated.noShowAppointments}</P>
                  <Muted className="text-xs">({noShowRate.toFixed(1)}%)</Muted>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Daily Breakdown */}
      {metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <P className="font-medium">
                        {metric.metric_at &&
                          new Date(metric.metric_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                      </P>
                      <Muted className="text-xs">
                        {metric.total_appointments || 0} appointments
                      </Muted>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <P className="font-medium">
                        {formatCurrency(metric.total_revenue || 0)}
                      </P>
                      <Muted className="text-xs">
                        {metric.completed_appointments || 0} completed
                      </Muted>
                    </div>
                    <div className="text-right min-w-16">
                      <Badge variant="outline">{(metric.utilization_rate || 0).toFixed(1)}%</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}
