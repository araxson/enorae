'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import type { BusinessMultiLocationMetrics } from '@/features/business/dashboard/api/types'
import { cn } from '@/lib/utils'
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Store,
  Users,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getAccentStripeClass, type MetricAccent } from './metric-card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type DashboardChainOverviewProps = {
  metrics: BusinessMultiLocationMetrics
}

const overviewItems = [
  {
    label: 'Total locations',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.totalLocations,
    icon: Building2,
    tooltip: 'Active locations that your tenant manages today.',
    accent: 'primary' as MetricAccent,
  },
  {
    label: 'Total appointments',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.totalAppointments,
    icon: CalendarDays,
    tooltip: 'Combined booked appointments across every location.',
    accent: 'secondary' as MetricAccent,
  },
  {
    label: 'Confirmed',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.confirmedAppointments,
    icon: CheckCircle2,
    tooltip: 'Guests who have confirmed attendance.',
    accent: 'accent' as MetricAccent,
  },
  {
    label: 'Pending',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.pendingAppointments,
    icon: ClipboardList,
    tooltip: 'Appointments awaiting confirmation.',
    accent: 'primary' as MetricAccent,
  },
  {
    label: 'Staff',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.totalStaff,
    icon: Users,
    tooltip: 'Active stylists and front desk team members.',
    accent: 'secondary' as MetricAccent,
  },
  {
    label: 'Services',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.totalServices,
    icon: Store,
    tooltip: 'Service offerings across your network.',
    accent: 'accent' as MetricAccent,
  },
] as const

export function DashboardChainOverview({ metrics }: DashboardChainOverviewProps) {
  const appointmentFill = metrics.totalAppointments === 0 ? 0 : Math.round((metrics.confirmedAppointments / metrics.totalAppointments) * 100)
  const metricValueClass = 'text-2xl font-semibold leading-none tracking-tight'

  return (
    <Item id="overview" variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <div className="flex items-center gap-2">
          <Building2 className="size-5" aria-hidden="true" />
          <ItemTitle>Chain overview</ItemTitle>
        </div>
        <ItemActions>
          <Badge variant="outline">Multi-location</Badge>
        </ItemActions>
      </ItemHeader>
      <ItemContent className="space-y-4">
        <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {overviewItems.map((item) => {
            const Icon = item.icon
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Item variant="outline" className="relative flex-col gap-3 overflow-hidden">
                    <span className={cn('absolute inset-y-0 left-0 w-1', getAccentStripeClass(item.accent))} aria-hidden="true" />
                    <ItemHeader>
                      <ItemDescription>{item.label}</ItemDescription>
                    </ItemHeader>
                    <ItemContent className="flex items-center justify-between gap-4">
                      <p className={metricValueClass}>{item.value(metrics)}</p>
                      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                    </ItemContent>
                  </Item>
                </TooltipTrigger>
                <TooltipContent>{item.tooltip}</TooltipContent>
              </Tooltip>
            )
          })}
        </ItemGroup>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="chain-health">
            <AccordionTrigger>Chain health metrics</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4">
                <Field>
                  <FieldLabel>Confirmation rate</FieldLabel>
                  <FieldContent className="gap-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Network average</span>
                      <span>{appointmentFill}%</span>
                    </div>
                    <Progress value={appointmentFill} aria-label="Confirmation rate progress" />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Key counts</FieldLabel>
                  <FieldContent className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">Staff: {metrics.totalStaff}</Badge>
                    <Badge variant="outline">Services: {metrics.totalServices}</Badge>
                    <Badge variant="outline">Pending: {metrics.pendingAppointments}</Badge>
                  </FieldContent>
                </Field>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ItemContent>
    </Item>
  )
}
