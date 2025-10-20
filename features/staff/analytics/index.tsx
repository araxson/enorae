import {
  getStaffPerformanceMetrics,
  getStaffRevenueBreakdown,
  getStaffCustomerRelationships,
  getStaffEarningsSummary,
} from './api/queries'
import { StaffAnalyticsDashboard } from './components/staff-analytics-dashboard'
import { Stack } from '@/components/layout'

export async function StaffAnalytics() {
  const metrics = await getStaffPerformanceMetrics()
  const revenueBreakdown = await getStaffRevenueBreakdown()
  const customerRelationships = await getStaffCustomerRelationships()
  const earnings = await getStaffEarningsSummary()

  return (
    <Stack gap="xl">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">My Analytics</h1>
        <p className="leading-7 text-muted-foreground">
          Track your performance, earnings, and customer relationships
        </p>
      </div>

      <StaffAnalyticsDashboard
        metrics={metrics}
        revenueBreakdown={revenueBreakdown}
        customerRelationships={customerRelationships}
        earnings={earnings}
      />
    </Stack>
  )
}
