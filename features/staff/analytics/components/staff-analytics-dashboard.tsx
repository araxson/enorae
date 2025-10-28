'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  StaffPerformanceMetrics,
  StaffRevenueBreakdown,
  CustomerRelationship,
} from '@/features/staff/analytics/api/queries'
import { MetricsSummary } from './dashboard/metrics-summary'
import { PerformanceTab } from './dashboard/performance-tab'
import { RevenueBreakdownTab } from './dashboard/revenue-breakdown-tab'
import { CustomerRelationshipsTab } from './dashboard/customer-relationships-tab'

interface StaffAnalyticsDashboardProps {
  metrics: StaffPerformanceMetrics
  revenueBreakdown: StaffRevenueBreakdown[]
  customerRelationships: CustomerRelationship[]
  earnings: {
    total_revenue: number
    estimated_commission: number
    commission_rate: number
    completed_appointments: number
    avg_earning_per_appointment: number
  }
}

export function StaffAnalyticsDashboard({
  metrics,
  revenueBreakdown,
  customerRelationships,
  earnings,
}: StaffAnalyticsDashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      <MetricsSummary metrics={metrics} earnings={earnings} />

      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="customers">Top Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <PerformanceTab metrics={metrics} />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueBreakdownTab revenueBreakdown={revenueBreakdown} />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerRelationshipsTab customerRelationships={customerRelationships} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
