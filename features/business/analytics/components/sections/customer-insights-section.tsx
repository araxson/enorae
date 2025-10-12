'use client'

import { Group } from '@/components/layout'
import { ExportButton } from '@/features/business/business-common/components'
import { CustomerInsightsCard } from '@/features/business/business-common/components/customer-insights-card'
import type { getCustomerInsights } from '../../api/queries'

type CustomerInsights = Awaited<ReturnType<typeof getCustomerInsights>>

type Props = {
  start: string
  end: string
  insights: CustomerInsights
}

export function CustomerInsightsSection({ start, end, insights }: Props) {
  return (
    <>
      <Group className="items-center justify-between">
        <div className="sr-only">Customer insights export</div>
        <ExportButton
          data={[
            {
              total_customers: insights.totalCustomers,
              new_customers: insights.newCustomers,
              returning_customers: insights.returningCustomers,
              retention_rate: Number(insights.retentionRate.toFixed(2)),
              avg_customer_value: Math.round(insights.averageLifetimeValue),
              avg_order_value: Math.round(insights.averageOrderValue),
            },
          ]}
          filename={`customer-insights-${start}-to-${end}`}
        />
      </Group>
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
    </>
  )
}
