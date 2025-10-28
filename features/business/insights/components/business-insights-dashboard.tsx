'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { BusinessAlertsSection } from './business-alerts-section'
import { BusinessTrendsTab } from './business-trends-tab'
import { BusinessRecommendationsTab } from './business-recommendations-tab'
import { BusinessOpportunitiesTab } from './business-opportunities-tab'

import type { TrendInsight, BusinessRecommendation, AnomalyAlert } from '@/features/business/insights/api/queries'

interface BusinessInsightsDashboardProps {
  trends: TrendInsight[]
  recommendations: BusinessRecommendation[]
  alerts: AnomalyAlert[]
  opportunities: Array<{
    type: string
    title: string
    description: string
    potential: string
  }>
}

export function BusinessInsightsDashboard({
  trends,
  recommendations,
  alerts,
  opportunities
}: BusinessInsightsDashboardProps) {
  return (
    <div className="flex flex-col gap-10">
      <BusinessAlertsSection alerts={alerts} />

      <Tabs defaultValue="trends" className="w-full">
        <TabsList>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">
            AI Recommendations ({recommendations.length})
          </TabsTrigger>
          {opportunities.length > 0 && (
            <TabsTrigger value="opportunities">Growth Opportunities</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="trends">
          <BusinessTrendsTab trends={trends} />
        </TabsContent>

        <TabsContent value="recommendations">
          <BusinessRecommendationsTab recommendations={recommendations} />
        </TabsContent>

        {opportunities.length > 0 && (
          <TabsContent value="opportunities">
            <BusinessOpportunitiesTab opportunities={opportunities} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
