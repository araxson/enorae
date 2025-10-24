'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const accentIndicatorClasses = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  accent: 'bg-accent',
  info: 'bg-secondary',
} as const

export type MetricAccent = keyof typeof accentIndicatorClasses

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
    <Card role="article" aria-label={`${title} metric`} className="relative overflow-hidden">
      <span className={cn('absolute inset-y-0 left-0 w-1', getAccentStripeClass(accent))} aria-hidden="true" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold">{value}</div>
        <Progress value={progress} className="mt-2" aria-label={`${progress}% progress`} />
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
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
    <Card role="article" aria-label={`${title} metric`} className="relative overflow-hidden">
      <span className={cn('absolute inset-y-0 left-0 w-1', getAccentStripeClass(accent))} aria-hidden="true" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold">{amountLabel}</div>
        {highlight}
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
