import {
  getStaffPerformanceMetrics,
  getStaffRevenueBreakdown,
  getStaffCustomerRelationships,
  getStaffEarningsSummary,
} from './api/queries'
import { StaffAnalyticsDashboard } from './components/staff-analytics-dashboard'
import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function StaffAnalytics() {
  const metrics = await getStaffPerformanceMetrics()
  const revenueBreakdown = await getStaffRevenueBreakdown()
  const customerRelationships = await getStaffCustomerRelationships()
  const earnings = await getStaffEarningsSummary()

  return (
    <Stack gap="xl">
      <div>
        <H1>My Analytics</H1>
        <P className="text-muted-foreground">
          Track your performance, earnings, and customer relationships
        </P>
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
