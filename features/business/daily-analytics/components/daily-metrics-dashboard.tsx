'use client'
import { DailyBreakdownList } from './partials/daily-breakdown-list'
import { KeyMetricsGrid } from './partials/key-metrics-grid'
import { RevenueBreakdownCards } from './partials/revenue-breakdown-cards'
import { AppointmentIssuesCard } from './partials/appointment-issues-card'
import type { DailyMetricsDashboardProps } from '../api/types'

type Props = DailyMetricsDashboardProps

export function DailyMetricsDashboard({ metrics, aggregated, trends }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <KeyMetricsGrid aggregated={aggregated} trends={trends} />

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <RevenueBreakdownCards aggregated={aggregated} />
        <AppointmentIssuesCard aggregated={aggregated} />
      </div>

      <DailyBreakdownList metrics={metrics} />
    </div>
  )
}
