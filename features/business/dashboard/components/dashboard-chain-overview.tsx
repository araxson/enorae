'use client'

import { Building2, Users, CalendarDays, CheckCircle2, ClipboardList, Store } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Small } from '@/components/ui/typography'
import { Progress } from '@/components/ui/progress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Grid, Stack, Group } from '@/components/layout'
import type { BusinessMultiLocationMetrics } from '../types'

type DashboardChainOverviewProps = {
  metrics: BusinessMultiLocationMetrics
}

const overviewItems = [
  {
    label: 'Total locations',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.totalLocations,
    icon: Building2,
    tooltip: 'Active locations that your tenant manages today.',
    accent: 'border-l-indigo-500',
  },
  {
    label: 'Total appointments',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.totalAppointments,
    icon: CalendarDays,
    tooltip: 'Combined booked appointments across every location.',
    accent: 'border-l-blue-500',
  },
  {
    label: 'Confirmed',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.confirmedAppointments,
    icon: CheckCircle2,
    tooltip: 'Guests who have confirmed attendance.',
    accent: 'border-l-emerald-500',
  },
  {
    label: 'Pending',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.pendingAppointments,
    icon: ClipboardList,
    tooltip: 'Appointments awaiting confirmation.',
    accent: 'border-l-amber-500',
  },
  {
    label: 'Staff',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.totalStaff,
    icon: Users,
    tooltip: 'Active stylists and front desk team members.',
    accent: 'border-l-purple-500',
  },
  {
    label: 'Services',
    value: (metrics: BusinessMultiLocationMetrics) => metrics.totalServices,
    icon: Store,
    tooltip: 'Service offerings across your network.',
    accent: 'border-l-pink-500',
  },
] as const

export function DashboardChainOverview({ metrics }: DashboardChainOverviewProps) {
  const appointmentFill = metrics.totalAppointments === 0 ? 0 : Math.round((metrics.confirmedAppointments / metrics.totalAppointments) * 100)

  return (
    <Card id="overview">
      <CardHeader>
        <Group className="items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" aria-hidden="true" />
            Chain overview
          </CardTitle>
          <Badge variant="outline">Multi-location</Badge>
        </Group>
      </CardHeader>
      <CardContent className="space-y-4">
        <Grid cols={{ base: 1, md: 3 }} gap="md">
          {overviewItems.map((item) => {
            const Icon = item.icon
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <div className={`overflow-hidden rounded-xl border border-border/60 bg-card/60 p-4 transition-colors hover:border-primary/40 ${item.accent}`}>
                    <Group className="items-center justify-between">
                      <Small className="text-muted-foreground">{item.label}</Small>
                      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </Group>
                    <div className="mt-2 text-2xl font-semibold text-foreground">{item.value(metrics)}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{item.tooltip}</TooltipContent>
              </Tooltip>
            )
          })}
        </Grid>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="chain-health">
            <AccordionTrigger>Chain health metrics</AccordionTrigger>
            <AccordionContent>
              <Stack gap="md">
                <Stack gap="xs">
                  <Group className="items-center justify-between">
                    <Small className="font-medium text-muted-foreground">Confirmation rate</Small>
                    <Small className="text-muted-foreground">{appointmentFill}%</Small>
                  </Group>
                  <Progress value={appointmentFill} aria-label="Confirmation rate progress" />
                </Stack>
                <Group className="flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <Badge variant="outline">Staff: {metrics.totalStaff}</Badge>
                  <Badge variant="outline">Services: {metrics.totalServices}</Badge>
                  <Badge variant="outline">Pending: {metrics.pendingAppointments}</Badge>
                </Group>
              </Stack>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
