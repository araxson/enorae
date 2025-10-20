import { getInsightsSummary, getCustomerInsights } from './api/queries'
import { CustomerInsightsDashboard } from './components/customer-insights-dashboard'
import { Stack } from '@/components/layout'

export async function CustomerInsights() {
  const [summary, topCustomers] = await Promise.all([
    getInsightsSummary(),
    getCustomerInsights(50),
  ])

  return (
    <Stack gap="xl">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Customer Insights</h1>
        <p className="leading-7 text-muted-foreground">
          Customer segmentation, lifetime value analysis, and retention metrics
        </p>
      </div>

      <CustomerInsightsDashboard summary={summary} topCustomers={topCustomers} />
    </Stack>
  )
}
