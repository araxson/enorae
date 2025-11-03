'use client'

import { useMemo, type ReactNode } from 'react'
import { Calendar, CheckCircle, Clock, Users, Scissors, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { BusinessDashboardMetrics } from '@/features/business/dashboard/api/types'
import { AppointmentMetricCard, RevenueMetricCard, getAccentStripeClass, type MetricAccent } from './metric-card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'

type MetricsCardsProps = {
  metrics: BusinessDashboardMetrics
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const formatCurrency = (amount = 0) => CURRENCY_FORMATTER.format(amount)

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const confirmationRate = useMemo(() => {
    if (metrics.totalAppointments === 0) return 0
    return Math.round((metrics.confirmedAppointments / metrics.totalAppointments) * 100)
  }, [metrics.confirmedAppointments, metrics.totalAppointments])

  const pendingRate = useMemo(() => {
    if (metrics.totalAppointments === 0) return 0
    return Math.round((metrics.pendingAppointments / metrics.totalAppointments) * 100)
  }, [metrics.pendingAppointments, metrics.totalAppointments])

  const revenueMetrics = useMemo(() => [
    metrics.totalRevenue !== undefined && {
      title: 'Total Revenue',
      icon: <DollarSign className="size-4 text-muted-foreground" aria-hidden="true" />,
      accent: 'primary' as const,
      amountLabel: formatCurrency(metrics.totalRevenue),
      description: 'All-time earnings',
    },
    metrics.last30DaysRevenue !== undefined && {
      title: 'Last 30 Days',
      icon: <TrendingUp className="size-4 text-muted-foreground" aria-hidden="true" />,
      accent: 'success' as const,
      amountLabel: formatCurrency(metrics.last30DaysRevenue),
      description: 'Active revenue stream',
      highlight: (
        <div className="flex items-center gap-2">
          <ArrowUpRight className="size-3 text-primary" aria-hidden="true" />
          <p className="text-sm font-medium text-primary">Momentum trending upward</p>
        </div>
      ),
    },
  ].filter(Boolean), [metrics.totalRevenue, metrics.last30DaysRevenue])

  const appointmentMetrics = useMemo(() => [
    {
      title: 'Total',
      icon: <Calendar className="size-4 text-primary" aria-hidden="true" />,
      value: metrics.totalAppointments,
      progress: 100,
      description: 'All bookings',
      accent: 'primary' as const,
    },
    {
      title: 'Confirmed',
      icon: <CheckCircle className="size-4 text-primary" aria-hidden="true" />,
      value: metrics.confirmedAppointments,
      progress: confirmationRate,
      description: `${confirmationRate}% of total`,
      accent: 'success' as const,
    },
    {
      title: 'Pending',
      icon: <Clock className="size-4 text-accent" aria-hidden="true" />,
      value: metrics.pendingAppointments,
      progress: pendingRate,
      description: 'Awaiting confirmation',
      accent: 'warning' as const,
    },
  ], [metrics.totalAppointments, metrics.confirmedAppointments, metrics.pendingAppointments, confirmationRate, pendingRate])

  return (
    <div className="flex flex-col gap-8">
      <Field>
        <FieldLabel>Dashboard summary</FieldLabel>
        <FieldContent>
          <FieldDescription>Monitor the metrics your team watches daily.</FieldDescription>
        </FieldContent>
      </Field>

      {revenueMetrics.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {revenueMetrics.filter((m): m is Exclude<typeof m, false> => Boolean(m)).map((metric) => (
            <RevenueMetricCard key={metric.title} {...metric} />
          ))}
        </div>
      )}

      <Separator />

      <div className="flex flex-col gap-4">
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>Appointments overview</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Badge variant="outline">{confirmationRate}% Confirmed</Badge>
            </ItemActions>
          </Item>
        </ItemGroup>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {appointmentMetrics.map((metric) => (
            <AppointmentMetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </div>

      <Separator />

      <Field>
        <FieldLabel>Resources</FieldLabel>
        <FieldContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <AppointmentResource
                  title="Staff Members"
                  icon={<Users className="size-4 text-secondary" aria-hidden="true" />}
                  value={metrics.totalStaff}
                  accent="accent"
                  description="Active team members"
                />
            </TooltipTrigger>
            <TooltipContent>Ensure coverage across peak hours</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <AppointmentResource
                title="Services Offered"
                icon={<Scissors className="size-4 text-secondary-foreground" aria-hidden="true" />}
                value={metrics.totalServices}
                accent="secondary"
                description="Available services"
              />
            </TooltipTrigger>
            <TooltipContent>Audit catalogs to avoid duplicates</TooltipContent>
          </Tooltip>
          </div>
        </FieldContent>
      </Field>
    </div>
  )
}

const resourceValueClass = 'text-2xl font-semibold leading-none tracking-tight'

type AppointmentResourceProps = {
  title: string
  icon: ReactNode
  value: number
  description: string
  accent: MetricAccent
}

function AppointmentResource({ title, icon, value, description, accent }: AppointmentResourceProps) {
  return (
    <Item variant="outline" className="relative flex-col gap-3 overflow-hidden">
      <span className={cn('absolute inset-y-0 left-0 w-1', getAccentStripeClass(accent))} aria-hidden="true" />
      <ItemHeader>
        <ItemTitle>{title}</ItemTitle>
        <ItemActions>{icon}</ItemActions>
      </ItemHeader>
      <ItemContent className="space-y-2">
        <p className={resourceValueClass}>{value}</p>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
    </Item>
  )
}
