'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { DynamicPricingSummaryCards } from './dynamic-pricing-summary-cards'
import { PricingRulesTab } from './pricing-rules-tab'
import { PriceScenariosTab } from './price-scenarios-tab'
import { RevenueInsightsTab } from './revenue-insights-tab'

interface PricingRule {
  day_of_week: string
  hour_start: number
  hour_end: number
  adjustment_type: 'discount' | 'surge'
  adjustment_percentage: number
}

interface PricingScenario {
  day: string
  hour: number
  base_price: number
  adjusted_price: number
  adjustment_type: string
  adjustment_percentage: number
}

interface PricingInsight {
  service_id: string
  service_name: string
  base_price: number
  avg_off_peak_price: number
  avg_peak_price: number
  potential_revenue_increase: number
}

interface DynamicPricingDashboardProps {
  rules: PricingRule[]
  scenarios: PricingScenario[]
  insights: PricingInsight[]
  services: { id: string }[]
}

export function DynamicPricingDashboard({
  rules,
  scenarios,
  insights,
  services,
}: DynamicPricingDashboardProps) {
  const [selectedDay, setSelectedDay] = useState<string>('all')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatTime = (hour: number) => {
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${suffix}`
  }

  const getDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  const totalPotentialRevenue = insights.reduce(
    (sum, i) => sum + i.potential_revenue_increase,
    0
  )

  return (
    <div className="flex flex-col gap-8">
      <DynamicPricingSummaryCards
        rules={rules}
        totalPotentialRevenue={totalPotentialRevenue}
        servicesCount={services.length}
        formatCurrency={formatCurrency}
      />

      <Tabs defaultValue="rules" className="w-full">
        <TabsList>
          <TabsTrigger value="rules">Pricing Rules</TabsTrigger>
          <TabsTrigger value="scenarios">Price Scenarios</TabsTrigger>
          <TabsTrigger value="insights">Revenue Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <PricingRulesTab
            rules={rules}
            formatTime={formatTime}
            getDayName={getDayName}
          />
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <PriceScenariosTab
            scenarios={scenarios}
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
            formatCurrency={formatCurrency}
            formatTime={formatTime}
            getDayName={getDayName}
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <RevenueInsightsTab
            insights={insights}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
