'use client'

import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
type AppointmentMetricCardProps = {
  title: string
  icon: ReactNode
  value: number
  progress: number
  description: string
  accent: string
  progressClass?: string
}

export function AppointmentMetricCard({
  title,
  icon,
  value,
  progress,
  description,
  accent,
  progressClass,
}: AppointmentMetricCardProps) {
  return (
    <Card role="article" aria-label={`${title} metric`} className={`overflow-hidden border-l-4 ${accent}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <Progress value={progress} className={`mt-2 h-1 ${progressClass ?? ''}`} aria-label={`${progress}% progress`} />
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

type RevenueMetricCardProps = {
  title: string
  icon: ReactNode
  accent: string
  amountLabel: string
  description: string
  highlight?: ReactNode
}

export function RevenueMetricCard({
  title,
  icon,
  accent,
  amountLabel,
  description,
  highlight,
}: RevenueMetricCardProps) {
  return (
    <Card role="article" aria-label={`${title} metric`} className={`overflow-hidden border-l-4 ${accent}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold">{amountLabel}</div>
        {highlight}
        <small className="text-sm font-medium leading-none text-xs text-muted-foreground">{description}</small>
      </CardContent>
    </Card>
  )
}
