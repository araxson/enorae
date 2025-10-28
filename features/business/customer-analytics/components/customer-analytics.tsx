import { CustomerInsightsCard } from '@/features/business/business-common/components/customer-insights-card'
import { CohortsTable } from '@/features/business/analytics/components/sections/cohorts-table'
import { ChurnRiskTable, ReactivationOpportunities, SegmentationOverview } from '.'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import { getCustomerInsights, getCustomerSegmentation, getCustomerCohorts } from '@/features/business/analytics/api/queries'
import { getAtRiskCustomers, getReactivationOpportunities } from '@/features/business/insights/api/queries/churn-prediction'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

export async function CustomerAnalytics() {
  const salon = await getUserSalon()
  if (!salon?.id) {
    throw new Error('Salon not found')
  }
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 90)

  const start: string = startDate.toISOString().split('T')[0] || ''
  const end: string = endDate.toISOString().split('T')[0] || ''

  const [insights, segmentation, cohorts, atRiskCustomers, reactivation] = await Promise.all([
    getCustomerInsights(salon.id, start, end),
    getCustomerSegmentation(salon.id),
    getCustomerCohorts(salon.id, 6),
    getAtRiskCustomers(10),
    getReactivationOpportunities(),
  ])

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item className="flex-col items-start gap-1">
                <ItemContent>
                  <ItemTitle>Customer intelligence</ItemTitle>
                </ItemContent>
                <ItemContent>
                  <ItemDescription>
                    Deep dive into lifetime value, retention, and churn risk to focus on the right customers.
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
        </Card>

        <CustomerInsightsCard
          data={{
            totalCustomers: insights.totalCustomers,
            newCustomers: insights.newCustomers,
            returningCustomers: insights.returningCustomers,
            retentionRate: insights.retentionRate,
            averageLifetimeValue: insights.averageLifetimeValue,
            averageOrderValue: insights.averageOrderValue,
            topCustomers: insights.topCustomers,
          }}
        />

        <SegmentationOverview data={segmentation} />

        <div className="grid gap-4 xl:grid-cols-2">
          <ChurnRiskTable customers={atRiskCustomers} />
          <ReactivationOpportunities
            total={reactivation.totalOpportunities}
            customers={reactivation.customers}
          />
        </div>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <ItemTitle>Cohort retention</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <CohortsTable cohorts={cohorts} start={start} end={end} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
