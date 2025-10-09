import { getInsightsSummary, getCustomerInsights } from './api/queries'
import { CustomerInsightsDashboard } from './components/customer-insights-dashboard'
import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function CustomerInsights() {
  const [summary, topCustomers] = await Promise.all([
    getInsightsSummary(),
    getCustomerInsights(50),
  ])

  return (
    <Stack gap="xl">
      <div>
        <H1>Customer Insights</H1>
        <P className="text-muted-foreground">
          Customer segmentation, lifetime value analysis, and retention metrics
        </P>
      </div>

      <CustomerInsightsDashboard summary={summary} topCustomers={topCustomers} />
    </Stack>
  )
}
