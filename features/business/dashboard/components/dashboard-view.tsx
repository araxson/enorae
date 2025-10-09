'use client'

import type { ReactNode } from 'react'
import { Section, Stack } from '@/components/layout'
import type { BusinessDashboardState } from '../types'
import { DashboardToolbar } from './dashboard-toolbar'
import { DashboardFilters } from './dashboard-filters'
import { DashboardChainOverview } from './dashboard-chain-overview'
import { DashboardTabs } from './dashboard-tabs'

type DashboardViewProps = BusinessDashboardState & {
  analyticsPanel: ReactNode
}

export function DashboardView({
  salon,
  metrics,
  reviewStats,
  recentAppointments,
  multiLocationMetrics,
  isTenantOwner,
  analyticsPanel,
}: DashboardViewProps) {
  return (
    <Section size="lg" fullWidth>
      <Stack gap="lg">
        <DashboardToolbar
          salonName={salon.name ?? 'Salon'}
          isTenantOwner={isTenantOwner}
          totalLocations={multiLocationMetrics?.totalLocations}
        />

        <DashboardFilters />

        {isTenantOwner && multiLocationMetrics ? (
          <DashboardChainOverview metrics={multiLocationMetrics} />
        ) : null}

        <DashboardTabs
          metrics={metrics}
          reviewStats={reviewStats}
          appointments={recentAppointments}
          analyticsPanel={analyticsPanel}
        />
      </Stack>
    </Section>
  )
}
