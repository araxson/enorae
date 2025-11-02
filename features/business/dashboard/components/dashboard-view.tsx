'use client'

import { memo, type ReactNode } from 'react'
import type { BusinessDashboardState } from '@/features/business/dashboard/types'
import { DashboardToolbar } from './dashboard-toolbar'
import { DashboardFilters } from './dashboard-filters'
import { DashboardChainOverview } from './dashboard-chain-overview'
import { DashboardTabs } from './dashboard-tabs'

type DashboardViewProps = BusinessDashboardState & {
  analyticsPanel: ReactNode
}

export const DashboardView = memo(function DashboardView({
  salon,
  metrics,
  reviewStats,
  recentAppointments,
  multiLocationMetrics,
  isTenantOwner,
  analyticsPanel,
}: DashboardViewProps) {
  return (
    <section className="py-10 w-full px-6">
      <div className="flex flex-col gap-6">
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
      </div>
    </section>
  )
})
