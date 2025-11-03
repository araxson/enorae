'use client'

import type { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { BusinessDashboardMetrics, BusinessReviewStats, AppointmentWithDetails } from '@/features/business/dashboard/api/types'
import { QuickActions } from '@/features/business/business-common/components/quick-actions'
import { MetricsCards } from './metrics-cards'
import { ReviewsCard } from './reviews-card'
import { RecentBookings } from './recent-bookings'

type DashboardTabsProps = {
  metrics: BusinessDashboardMetrics
  reviewStats: BusinessReviewStats
  appointments: AppointmentWithDetails[]
  analyticsPanel: ReactNode
}

export function DashboardTabs({ metrics, reviewStats, appointments, analyticsPanel }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full" id="dashboard-tabs">
      <TabsList className="grid w-full max-w-md grid-cols-3" aria-label="Dashboard sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" id="overview" className="mt-6">
        <div className="flex flex-col gap-6">
          <QuickActions />
          <MetricsCards metrics={metrics} />
          <ReviewsCard stats={reviewStats} />
          <RecentBookings appointments={appointments} />
        </div>
      </TabsContent>

      <TabsContent value="appointments" id="appointments" className="mt-6">
        <RecentBookings appointments={appointments} />
      </TabsContent>

      <TabsContent value="analytics" id="analytics" className="mt-6">
        {analyticsPanel}
      </TabsContent>
    </Tabs>
  )
}
