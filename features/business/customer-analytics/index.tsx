import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { CustomerInsightsCard } from '@/features/business/business-common/components/customer-insights-card'
import { CohortsTable } from '@/features/business/analytics/components/sections/cohorts-table'
import { SegmentationOverview } from './components/segmentation-overview'
import { ChurnRiskTable } from './components/churn-risk-table'
import { ReactivationOpportunities } from './components/reactivation-opportunities'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import { getCustomerInsights, getCustomerSegmentation, getCustomerCohorts } from '@/features/business/analytics/api/queries'
import { getAtRiskCustomers, getReactivationOpportunities } from '@/features/business/insights/api/churn-prediction'

export async function CustomerAnalytics() {
  const salon = await getUserSalon()
  if (!salon?.id) {
    throw new Error('Salon not found')
  }
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 90)

  const start = startDate.toISOString().split('T')[0]
  const end = endDate.toISOString().split('T')[0]

  const [insights, segmentation, cohorts, atRiskCustomers, reactivation] = await Promise.all([
    getCustomerInsights(salon.id, start, end),
    getCustomerSegmentation(salon.id),
    getCustomerCohorts(salon.id, 6),
    getAtRiskCustomers(10),
    getReactivationOpportunities(),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Customer Intelligence</H1>
          <P className="text-muted-foreground">
            Deep dive into lifetime value, retention, and churn risk to focus on the right customers.
          </P>
        </div>

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

        <div>
          <h2 className="text-2xl font-semibold mb-3">Cohort Retention</h2>
          <CohortsTable cohorts={cohorts} start={start} end={end} />
        </div>
      </Stack>
    </Section>
  )
}
