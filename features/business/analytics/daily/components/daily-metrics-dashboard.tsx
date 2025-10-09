'use client'

import { Stack, Grid } from '@/components/layout'
import { DailyBreakdownList } from './partials/daily-breakdown-list'
import { KeyMetricsGrid } from './partials/key-metrics-grid'
import { RevenueBreakdownCards } from './partials/revenue-breakdown-cards'
import { AppointmentIssuesCard } from './partials/appointment-issues-card'
import type { DailyMetricsDashboardProps } from './types'

type Props = DailyMetricsDashboardProps

export function DailyMetricsDashboard({ metrics, aggregated, trends }: Props) {
  return (
    <Stack gap="xl">
      <KeyMetricsGrid aggregated={aggregated} trends={trends} />

      <Grid cols={{ base: 1, md: 3 }} gap="lg">
        <RevenueBreakdownCards aggregated={aggregated} />
        <AppointmentIssuesCard aggregated={aggregated} />
      </Grid>

      <DailyBreakdownList metrics={metrics} />
    </Stack>
  )
}
