'use client'

import { useState } from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

import { CustomerInsightsSummaryCards } from './customer-insights-summary-cards'
import { CustomerSegmentationCard } from './customer-segmentation-card'
import { CustomerListItem } from './customer-list-item'

import type { CustomerMetrics, InsightsSummary } from '@/features/business/insights/api/queries'

interface CustomerInsightsDashboardProps {
  summary: InsightsSummary
  topCustomers: CustomerMetrics[]
}

export function CustomerInsightsDashboard({
  summary,
  topCustomers,
}: CustomerInsightsDashboardProps) {
  const [selectedSegment, setSelectedSegment] = useState<string>('all')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const filteredCustomers =
    selectedSegment === 'all'
      ? topCustomers
      : topCustomers.filter((c) => c.segment.toLowerCase() === selectedSegment)

  return (
    <div className="flex flex-col gap-6">
      <CustomerInsightsSummaryCards
        summary={summary}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentage}
      />

      <CustomerSegmentationCard summary={summary} />

      <Tabs defaultValue="all" onValueChange={setSelectedSegment}>
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
          <TabsTrigger value="loyal">Loyal</TabsTrigger>
          <TabsTrigger value="at risk">At Risk</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedSegment} className="space-y-4">
          <Card>
            <CardHeader>
              <ItemGroup>
                <Item className="flex-col items-start gap-1">
                  <ItemContent>
                    <ItemTitle>
                      {selectedSegment === 'all'
                        ? 'Top Customers by Lifetime Value'
                        : `${selectedSegment.charAt(0).toUpperCase() + selectedSegment.slice(1)} Customers`}
                    </ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>
                      Detailed customer insights and metrics ({filteredCustomers.length} customers)
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <CustomerListItem
                      key={customer.customer_id}
                      customer={customer}
                      isLast={index === filteredCustomers.length - 1}
                      formatCurrency={formatCurrency}
                      formatPercentage={formatPercentage}
                    />
                  ))
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No customers in this segment</EmptyTitle>
                      <EmptyDescription>Adjust your segment filters to explore other customer groups.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
