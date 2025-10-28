import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
import { generateMetadata as genMeta } from '@/lib/metadata'
import {
  getStaffPerformanceMetrics,
  getStaffRevenueBreakdown,
  getStaffCustomerRelationships,
  getStaffEarningsSummary,
} from './api/queries'
import { StaffAnalyticsDashboard } from './components'

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
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemContent>
                  <CardTitle>My Analytics</CardTitle>
                  <CardDescription>
                    Track your performance, earnings, and customer relationships
                  </CardDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
        </Card>

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
