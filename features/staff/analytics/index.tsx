import { generateMetadata as genMeta } from '@/lib/metadata'
import {
  getStaffPerformanceMetrics,
  getStaffRevenueBreakdown,
  getStaffCustomerRelationships,
  getStaffEarningsSummary,
} from './api/queries'
import { StaffAnalyticsDashboard } from './components/staff-analytics-dashboard'
export const staffAnalyticsMetadata = genMeta({
  title: 'My Analytics',
  description: 'Track your performance, earnings, and customer relationships',
})

export async function StaffAnalytics() {
  const metrics = await getStaffPerformanceMetrics()
  const revenueBreakdown = await getStaffRevenueBreakdown()
  const customerRelationships = await getStaffCustomerRelationships()
  const earnings = await getStaffEarningsSummary()

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">My Analytics</h1>
          <p className="text-muted-foreground">
            Track your performance, earnings, and customer relationships
          </p>
        </div>

        <StaffAnalyticsDashboard
          metrics={metrics}
          revenueBreakdown={revenueBreakdown}
          customerRelationships={customerRelationships}
          earnings={earnings}
        />
      </div>
    </section>
  )
}
