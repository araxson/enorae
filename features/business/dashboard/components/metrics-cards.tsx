'use client'

import { useMemo, type ReactNode } from 'react'
import { Calendar, CheckCircle, Clock, Users, Scissors, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { BusinessDashboardMetrics } from '../types'
import { AppointmentMetricCard, RevenueMetricCard } from './metric-card'

type MetricsCardsProps = {
  metrics: BusinessDashboardMetrics
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const confirmationRate = useMemo(() => {
    if (metrics.totalAppointments === 0) return 0
    return Math.round((metrics.confirmedAppointments / metrics.totalAppointments) * 100)
  }, [metrics.confirmedAppointments, metrics.totalAppointments])

  const pendingRate = useMemo(() => {
    if (metrics.totalAppointments === 0) return 0
    return Math.round((metrics.pendingAppointments / metrics.totalAppointments) * 100)
  }, [metrics.pendingAppointments, metrics.totalAppointments])

  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  const revenueMetrics = [
    metrics.totalRevenue !== undefined && {
      title: 'Total Revenue',
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />,
      accent: 'border-l-primary',
      amountLabel: formatCurrency(metrics.totalRevenue),
      description: 'All-time earnings',
    },
    metrics.last30DaysRevenue !== undefined && {
      title: 'Last 30 Days',
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />,
      accent: 'border-l-success',
      amountLabel: formatCurrency(metrics.last30DaysRevenue),
      description: 'Active revenue stream',
      highlight: (
        <div className="flex items-center gap-2">
          <ArrowUpRight className="h-3 w-3 text-primary" aria-hidden="true" />
          <p className="text-sm font-medium text-primary">Momentum trending upward</p>
        </div>
      ),
    },
  ].filter(Boolean)

  const appointmentMetrics = [
    {
      title: 'Total',
      icon: <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />,
      value: metrics.totalAppointments,
      progress: 100,
      description: 'All bookings',
      accent: 'border-l-primary',
    },
    {
      title: 'Confirmed',
      icon: <CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />,
      value: metrics.confirmedAppointments,
      progress: confirmationRate,
      description: `${confirmationRate}% of total`,
      accent: 'border-l-success',
    },
    {
      title: 'Pending',
      icon: <Clock className="h-4 w-4 text-accent" aria-hidden="true" />,
      value: metrics.pendingAppointments,
      progress: pendingRate,
      description: 'Awaiting confirmation',
      accent: 'border-l-warning',
      progressClass: '[&>div]:bg-accent',
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Dashboard summary
        </p>
        <p className="text-sm font-medium text-muted-foreground">Monitor the metrics your team watches daily.</p>
      </div>

      {revenueMetrics.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {revenueMetrics.filter((m): m is Exclude<typeof m, false> => Boolean(m)).map((metric) => (
            <RevenueMetricCard key={metric.title} {...metric} />
          ))}
        </div>
      )}

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Appointments Overview</p>
          <Badge variant="outline">{confirmationRate}% Confirmed</Badge>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {appointmentMetrics.map((metric) => (
            <AppointmentMetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-muted-foreground">Resources</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <AppointmentResource
                title="Staff Members"
                icon={<Users className="h-4 w-4 text-secondary" aria-hidden="true" />}
                value={metrics.totalStaff}
                accent="border-l-info"
                description="Active team members"
              />
            </TooltipTrigger>
            <TooltipContent>Ensure coverage across peak hours</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <AppointmentResource
                title="Services Offered"
                icon={<Scissors className="h-4 w-4 text-secondary-foreground" aria-hidden="true" />}
                value={metrics.totalServices}
                accent="border-l-secondary"
                description="Available services"
              />
            </TooltipTrigger>
            <TooltipContent>Audit catalogs to avoid duplicates</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

type AppointmentResourceProps = {
  title: string
  icon: ReactNode
  value: number
  description: string
  accent: string
}

function AppointmentResource({ title, icon, value, description, accent }: AppointmentResourceProps) {
  return (
    <div className={`overflow-hidden rounded-xl border-l-4 ${accent}`}>
      <div className="flex items-center justify-between space-y-0 border px-4 py-3">
        <p className="text-sm font-medium">{title}</p>
        {icon}
      </div>
      <div className="border border-t-0 px-4 py-3">
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
