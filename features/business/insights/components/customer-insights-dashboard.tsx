'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

import { CustomerInsightsSummaryCards } from './customer-insights-summary-cards'
import { CustomerSegmentationCard } from './customer-segmentation-card'
import { CustomerListItem } from './customer-list-item'

import type { CustomerMetrics, InsightsSummary } from '@/features/business/insights/api/queries'

interface CustomerInsightsDashboardProps {
  summary: InsightsSummary
  topCustomers: CustomerMetrics[]
}

const segments = [
  { value: 'all', label: 'All Customers', title: 'Top Customers by Lifetime Value' },
  { value: 'vip', label: 'VIP', title: 'VIP Customers' },
  { value: 'loyal', label: 'Loyal', title: 'Loyal Customers' },
  { value: 'at risk', label: 'At Risk', title: 'At Risk Customers' },
  { value: 'new', label: 'New', title: 'New Customers' },
] as const

export function CustomerInsightsDashboard({
  summary,
  topCustomers,
}: CustomerInsightsDashboardProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="flex flex-col gap-6">
      <CustomerInsightsSummaryCards
        summary={summary}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentage}
      />

      <CustomerSegmentationCard summary={summary} />

      <Tabs defaultValue="all">
        <TabsList>
          {segments.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {segments.map(({ value, title }) => {
          const customersForSegment =
            value === 'all'
              ? topCustomers
              : topCustomers.filter((customer) => customer.segment.toLowerCase() === value)

          return (
            <TabsContent key={value} value={value}>
              <Card>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>
                    Detailed customer insights and metrics ({customersForSegment.length} customers)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    {customersForSegment.length > 0 ? (
                      customersForSegment.map((customer, index) => (
                        <CustomerListItem
                          key={customer.customer_id}
                          customer={customer}
                          isLast={index === customersForSegment.length - 1}
                          formatCurrency={formatCurrency}
                          formatPercentage={formatPercentage}
                        />
                      ))
                    ) : (
                      <Empty>
                        <EmptyHeader>
                          <EmptyTitle>No customers in this segment</EmptyTitle>
                          <EmptyDescription>
                            Adjust your filters to explore other customer groups.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Button variant="outline">View all segments</Button>
                        </EmptyContent>
                      </Empty>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
