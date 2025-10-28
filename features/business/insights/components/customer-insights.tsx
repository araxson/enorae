import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { getInsightsSummary, getCustomerInsights } from '@/features/business/insights/api/queries'
import { CustomerInsightsDashboard } from './customer-insights-dashboard'

export async function CustomerInsights() {
  const [summary, topCustomers] = await Promise.all([
    getInsightsSummary(),
    getCustomerInsights(50),
  ])

  return (
    <div className="flex flex-col gap-8">
      <ItemGroup>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Customer Insights</ItemTitle>
            <ItemDescription>
              Customer segmentation, lifetime value analysis, and retention metrics
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>

      <CustomerInsightsDashboard summary={summary} topCustomers={topCustomers} />
    </div>
  )
}
