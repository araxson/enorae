'use client'

import { Building2, Users, CalendarDays, CheckCircle2, ClipboardList, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { BusinessMultiLocationMetrics } from '../types'
import { getAccentStripeClass, type MetricAccent } from './metric-card'

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

  return (
    <Card id="overview">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" aria-hidden="true" />
            <CardTitle>Chain overview</CardTitle>
          </div>
          <Badge variant="outline">Multi-location</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {overviewItems.map((item) => {
            const Icon = item.icon
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Card className="relative overflow-hidden">
                    <span className={cn('absolute inset-y-0 left-0 w-1', getAccentStripeClass(item.accent))} aria-hidden="true" />
                    <CardHeader className="pb-2">
                      <CardDescription>{item.label}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-4 pt-0">
                      <div className="text-2xl font-semibold">{item.value(metrics)}</div>
                      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>{item.tooltip}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="chain-health">
            <AccordionTrigger>Chain health metrics</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-medium text-muted-foreground">Confirmation rate</div>
                    <div className="text-sm font-medium text-muted-foreground">{appointmentFill}%</div>
                  </div>
                  <Progress value={appointmentFill} aria-label="Confirmation rate progress" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="outline">Staff: {metrics.totalStaff}</Badge>
                  <Badge variant="outline">Services: {metrics.totalServices}</Badge>
                  <Badge variant="outline">Pending: {metrics.pendingAppointments}</Badge>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
