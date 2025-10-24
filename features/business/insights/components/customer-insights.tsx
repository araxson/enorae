import { getInsightsSummary, getCustomerInsights } from '@/features/business/insights/api/queries'
import { CustomerInsightsDashboard } from './customer-insights-dashboard'

export async function CustomerInsights() {
  const [summary, topCustomers] = await Promise.all([
    getInsightsSummary(),
    getCustomerInsights(50),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-3xl font-bold tracking-tight">Customer Insights</div>
        <p className="text-muted-foreground">
          Customer segmentation, lifetime value analysis, and retention metrics
        </p>
      </div>

      <CustomerInsightsDashboard summary={summary} topCustomers={topCustomers} />
    </div>
  )
}
