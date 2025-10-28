'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

const accentIndicatorClasses = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  accent: 'bg-accent',
  info: 'bg-secondary',
} as const

export type MetricAccent = keyof typeof accentIndicatorClasses

const metricValueClass = 'text-2xl font-semibold leading-none tracking-tight'

export function getAccentStripeClass(accent: MetricAccent) {
  return accentIndicatorClasses[accent]
}

type AppointmentMetricCardProps = {
  title: string
  icon: ReactNode
  value: number
  progress: number
  description: string
  accent?: MetricAccent
}

export function AppointmentMetricCard({
  title,
  icon,
  value,
  progress,
  description,
  accent = 'primary',
}: AppointmentMetricCardProps) {
  return (
    <Item role="article" aria-label={`${title} metric`} variant="outline" className="relative flex-col gap-3 overflow-hidden">
      <span className={cn('absolute inset-y-0 left-0 w-1', getAccentStripeClass(accent))} aria-hidden="true" />
      <ItemHeader>
        <ItemTitle>{title}</ItemTitle>
        <ItemActions>{icon}</ItemActions>
      </ItemHeader>
      <ItemContent className="space-y-2">
        <p className={metricValueClass}>{value}</p>
        <Progress value={progress} className="mt-2" aria-label={`${progress}% progress`} />
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
    </Item>
  )
}

type RevenueMetricCardProps = {
  title: string
  icon: ReactNode
  accent?: MetricAccent
  amountLabel: string
  description: string
  highlight?: ReactNode
}

export function RevenueMetricCard({
  title,
  icon,
  accent = 'primary',
  amountLabel,
  description,
  highlight,
}: RevenueMetricCardProps) {
  return (
    <Item role="article" aria-label={`${title} metric`} variant="outline" className="relative flex-col gap-3 overflow-hidden">
      <span className={cn('absolute inset-y-0 left-0 w-1', getAccentStripeClass(accent))} aria-hidden="true" />
      <ItemHeader>
        <ItemTitle>{title}</ItemTitle>
        <ItemActions>{icon}</ItemActions>
      </ItemHeader>
      <ItemContent className="space-y-2">
        <p className={metricValueClass}>{amountLabel}</p>
        {highlight}
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
    </Item>
  )
}
